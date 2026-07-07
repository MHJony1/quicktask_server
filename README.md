<!-- BACKEND README - Complete Code -->
<div style="background: #0d1117; color: #c9d1d9; padding: 40px; border-radius: 16px; font-family: 'Courier New', monospace; max-width: 100%; overflow-x: auto;">

<h1 style="color: #f0f6fc; font-size: 28px; border-bottom: 1px solid #30363d; padding-bottom: 16px;">⚙️ QuickTask - Backend API</h1>

<p style="color: #8b949e; font-size: 15px; margin-top: 8px;">RESTful API for QuickTask with Stripe payment integration.</p>

<h2 style="color: #f0f6fc; font-size: 20px; margin-top: 30px;">🌐 Live Demo</h2>
<p><a href="https://quicktask-server-swart.vercel.app/" style="color: #58a6ff;">https://quicktask-backend.onrender.com</a></p>

<h2 style="color: #f0f6fc; font-size: 20px; margin-top: 30px;">📁 Project Structure</h2>
<pre style="background: #161b22; padding: 16px; border-radius: 8px; color: #c9d1d9; overflow-x: auto;">
backend/
├── index.js          # Main server file
├── .env              # Environment variables
├── .gitignore        # Git ignore file
├── package.json      # Dependencies
├── package-lock.json # Lock file
└── vercel.json       # Vercel deployment config
</pre>

<h2 style="color: #f0f6fc; font-size: 20px; margin-top: 30px;">📦 Dependencies</h2>
<pre style="background: #161b22; padding: 16px; border-radius: 8px; color: #c9d1d9; overflow-x: auto;">
{
  "name": "quicktask-backend",
  "version": "1.0.0",
  "description": "QuickTask API with Stripe payment",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "stripe": "^14.20.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
</pre>

<h2 style="color: #f0f6fc; font-size: 20px; margin-top: 30px;">🔧 Environment Variables (.env)</h2>
<pre style="background: #161b22; padding: 16px; border-radius: 8px; color: #c9d1d9; overflow-x: auto;">
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quicktask

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Frontend URL
FRONTEND_URL=http://localhost:3000
</pre>

<h2 style="color: #f0f6fc; font-size: 20px; margin-top: 30px;">🚀 Getting Started</h2>

<h3 style="color: #f0f6fc; font-size: 16px;">Installation</h3>
<pre style="background: #161b22; padding: 16px; border-radius: 8px; color: #c9d1d9; overflow-x: auto;">
git clone--https://github.com/MHJony1/quicktask_server
cd quicktask-backend
npm install
cp .env.example .env
npm run dev
</pre>

<h2 style="color: #f0f6fc; font-size: 20px; margin-top: 30px;">📡 API Endpoints</h2>

<h3 style="color: #f0f6fc; font-size: 16px;">Authentication Routes</h3>
<table style="border-collapse: collapse; width: 100%; font-size: 13px;">
<tr style="background: #161b22;">
<th style="border: 1px solid #30363d; padding: 8px 12px; text-align: left;">Method</th>
<th style="border: 1px solid #30363d; padding: 8px 12px; text-align: left;">Endpoint</th>
<th style="border: 1px solid #30363d; padding: 8px 12px; text-align: left;">Description</th>
</tr>
<tr>
<td style="border: 1px solid #30363d; padding: 8px 12px;">POST</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">/api/auth/register</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">Register new user</td>
</tr>
<tr>
<td style="border: 1px solid #30363d; padding: 8px 12px;">POST</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">/api/auth/login</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">Login user</td>
</tr>
<tr>
<td style="border: 1px solid #30363d; padding: 8px 12px;">GET</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">/api/auth/me</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">Get current user (Protected)</td>
</tr>
</table>

<h3 style="color: #f0f6fc; font-size: 16px; margin-top: 16px;">Task Routes (Protected)</h3>
<table style="border-collapse: collapse; width: 100%; font-size: 13px;">
<tr style="background: #161b22;">
<th style="border: 1px solid #30363d; padding: 8px 12px; text-align: left;">Method</th>
<th style="border: 1px solid #30363d; padding: 8px 12px; text-align: left;">Endpoint</th>
<th style="border: 1px solid #30363d; padding: 8px 12px; text-align: left;">Description</th>
</tr>
<tr>
<td style="border: 1px solid #30363d; padding: 8px 12px;">GET</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">/api/tasks</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">Get all tasks</td>
</tr>
<tr>
<td style="border: 1px solid #30363d; padding: 8px 12px;">POST</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">/api/tasks</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">Create task (3 limit for free)</td>
</tr>
<tr>
<td style="border: 1px solid #30363d; padding: 8px 12px;">PUT</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">/api/tasks/:id</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">Update task</td>
</tr>
<tr>
<td style="border: 1px solid #30363d; padding: 8px 12px;">DELETE</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">/api/tasks/:id</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">Delete task</td>
</tr>
</table>

<h3 style="color: #f0f6fc; font-size: 16px; margin-top: 16px;">Payment Routes (Protected)</h3>
<table style="border-collapse: collapse; width: 100%; font-size: 13px;">
<tr style="background: #161b22;">
<th style="border: 1px solid #30363d; padding: 8px 12px; text-align: left;">Method</th>
<th style="border: 1px solid #30363d; padding: 8px 12px; text-align: left;">Endpoint</th>
<th style="border: 1px solid #30363d; padding: 8px 12px; text-align: left;">Description</th>
</tr>
<tr>
<td style="border: 1px solid #30363d; padding: 8px 12px;">POST</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">/api/payment/create-checkout</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">Create Stripe session</td>
</tr>
<tr>
<td style="border: 1px solid #30363d; padding: 8px 12px;">POST</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">/api/payment/verify</td>
<td style="border: 1px solid #30363d; padding: 8px 12px;">Verify payment</td>
</tr>
<tr>
</tr>
</table>

<h2 style="color: #f0f6fc; font-size: 20px; margin-top: 30px;">📦 Database Models</h2>

<h3 style="color: #f0f6fc; font-size: 16px;">User Model</h3>
<pre style="background: #161b22; padding: 16px; border-radius: 8px; color: #c9d1d9; overflow-x: auto;">
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  isPremium: Boolean (default: false),
  stripeCustomerId: String,
  createdAt: Date
}
</pre>

<h3 style="color: #f0f6fc; font-size: 16px; margin-top: 16px;">Task Model</h3>
<pre style="background: #161b22; padding: 16px; border-radius: 8px; color: #c9d1d9; overflow-x: auto;">
{
  title: String (required),
  description: String,
  status: String ('To Do', 'In Progress', 'Done'),
  user: ObjectId (ref: 'User'),
  createdAt: Date
}
</pre>

<h2 style="color: #f0f6fc; font-size: 20px; margin-top: 30px;">📝 Implementation Notes</h2>

<h3 style="color: #f0f6fc; font-size: 16px;">Challenges & Solutions</h3>
<ul style="list-style: none; padding: 0;">
<li style="padding: 6px 0;">🔸 <strong>Task Limit Enforcement:</strong> Check task count before creation, return error with TASK_LIMIT_REACHED code</li>
<li style="padding: 6px 0;">🔸 <strong>Payment Verification:</strong> Used both webhook and direct session verification for redundancy</li>
<li style="padding: 6px 0;">🔸 <strong>CORS:</strong> Proper CORS configuration with FRONTEND_URL environment variable</li>
<li style="padding: 6px 0;">🔸 <strong>Session Persistence:</strong> JWT tokens stored in HTTP-only cookies</li>
</ul>

<h2 style="color: #f0f6fc; font-size: 20px; margin-top: 30px;">📦 Deployment (Render)</h2>
<ol style="padding-left: 20px;">
<li>Push code to GitHub</li>
<li>Go to <a href="https://render.com" style="color: #58a6ff;">Vercel</a></li>
<li>Click "New +" → "Web Service"</li>
<li>Connect repository</li>
<li>Configure: Node, Build: npm install, Start: npm start</li>
<li>Add environment variables</li>
<li>Click "Create Web Service"</li>
</ol>


</div>
