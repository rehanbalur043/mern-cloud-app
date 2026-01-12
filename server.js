const express = require('express');
const cors = require('cors');
const pg = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'pern_app',
});

// ===== AUTH ROUTES (from auth service) =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Add your auth logic here (from your auth-service)
    res.json({ message: 'Register endpoint', email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Add your auth logic here
    res.json({ message: 'Login endpoint', email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== DATA ROUTES (from data service) =====
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Products"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const result = await pool.query(
      'INSERT INTO "Products" (name, price, description) VALUES ($1, $2, $3) RETURNING *',
      [name, price, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== SERVE REACT FRONTEND =====
// Static files from React build
app.use(express.static(path.join(__dirname, 'frontend/build')));

// All other routes serve React (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
