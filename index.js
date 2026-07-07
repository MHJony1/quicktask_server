const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');

dotenv.config();

// const Stripe = require('stripe');
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;
const app = express();

// --- middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true, // needed so the Better Auth session cookie is sent cross-origin
  }),
);
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const FREE_TASK_LIMIT = 3;
const VALID_STATUSES = ['To Do', 'In Progress', 'Done'];

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
);

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.CLIENT_URL,
      audience: process.env.CLIENT_URL,
    });

    req.user = payload;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return res
      .status(401)
      .json({ message: 'Not authorized, invalid or expired token' });
  }
}

module.exports = protect;

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const db = client.db('quicktask_db');
    const tasksCollection = db.collection('tasks');

    // 1. Create Task (post)
    app.post('/tasks', protect, async (req, res) => {
      try {
        const { title, description, status } = req.body;

        if (!title || !title.trim()) {
          return res.status(400).json({ message: 'Task title is required' });
        }

        const userId = req.user.id;
        const isPremium = Boolean(req.user.isPremium);

        // Free-tier limit: max 3 tasks
        if (!isPremium) {
          const taskCount = await tasksCollection.countDocuments({ userId });
          if (taskCount >= FREE_TASK_LIMIT) {
            return res.status(403).json({
              message: `Free plan is limited to ${FREE_TASK_LIMIT} tasks. Upgrade to Premium for unlimited tasks.`,
              code: 'TASK_LIMIT_REACHED',
            });
          }
        }

        const newTask = {
          title: title.trim(),
          description: description ? description.trim() : '',
          status: VALID_STATUSES.includes(status) ? status : 'To Do',
          userId, // <-- ties the task to its owner
          createdAt: new Date(),
        };

        const result = await tasksCollection.insertOne(newTask);
        res.status(201).send({ ...newTask, _id: result.insertedId });
      } catch (error) {
        console.error('Create task error:', error.message);
        res.status(500).json({ message: 'Failed to create task' });
      }
    });

    // 2. Read all tasks belonging to the logged-in user (get)
    app.get('/tasks', protect, async (req, res) => {
      try {
        const query = { userId: req.user.id }; // <-- only this user's tasks
        const result = await tasksCollection
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        console.error('Get tasks error:', error.message);
        res.status(500).json({ message: 'Failed to fetch tasks' });
      }
    });

    // 3. Read a single task by ID (get)
    app.get('/tasks/:id', protect, async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid task id' });
        }

        const query = { _id: new ObjectId(id) };
        const result = await tasksCollection.findOne(query);

        if (!result) {
          return res.status(404).json({ message: 'Task not found' });
        }
        if (result.userId !== req.user.id) {
          return res
            .status(403)
            .json({ message: 'Not authorized to view this task' });
        }

        res.send(result);
      } catch (error) {
        console.error('Get task error:', error.message);
        res.status(500).json({ message: 'Failed to fetch task' });
      }
    });

    // 4. Update a task by ID (patch)
    app.patch('/tasks/:id', protect, async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid task id' });
        }

        const query = { _id: new ObjectId(id) };
        const existingTask = await tasksCollection.findOne(query);

        if (!existingTask) {
          return res.status(404).json({ message: 'Task not found' });
        }
        if (existingTask.userId !== req.user.id) {
          return res
            .status(403)
            .json({ message: 'Not authorized to modify this task' });
        }

        const { title, description, status } = req.body;
        const updateFields = {};

        if (title !== undefined) {
          if (!title.trim()) {
            return res
              .status(400)
              .json({ message: 'Task title cannot be empty' });
          }
          updateFields.title = title.trim();
        }
        if (description !== undefined)
          updateFields.description = description.trim();
        if (status !== undefined) {
          if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
          }
          updateFields.status = status;
        }

        if (Object.keys(updateFields).length === 0) {
          return res.status(400).json({ message: 'Nothing to update' });
        }

        await tasksCollection.updateOne(query, { $set: updateFields });
        const updatedTask = await tasksCollection.findOne(query);
        res.send(updatedTask);
      } catch (error) {
        console.error('Update task error:', error.message);
        res.status(500).json({ message: 'Failed to update task' });
      }
    });

    // 5. Delete a task by ID (delete)
    app.delete('/tasks/:id', protect, async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid task id' });
        }

        const query = { _id: new ObjectId(id) };
        const existingTask = await tasksCollection.findOne(query);

        if (!existingTask) {
          return res.status(404).json({ message: 'Task not found' });
        }
        if (existingTask.userId !== req.user.id) {
          return res
            .status(403)
            .json({ message: 'Not authorized to delete this task' });
        }

        const result = await tasksCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error('Delete task error:', error.message);
        res.status(500).json({ message: 'Failed to delete task' });
      }
    });

    // 404 handler (for any route not matched above)
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

run().catch(console.dir);
