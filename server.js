const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' }); // Configure for S3 in production

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Connect to DB
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// --- MIDDLEWARE: Verify JWT Token ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- ROUTES ---

// 1. USER REGISTRATION
app.post('/api/register', async (req, res) => {
  // Hash password, insert into users table
});

// 2. USER LOGIN
app.post('/api/login', async (req, res) => {
  // Check credentials, return JWT token
});

// 3. GET ALL VERIFIED PROFILES (for the map)
app.get('/api/profiles', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, description, ST_AsGeoJSON(location) as location, is_verified
      FROM profiles
      WHERE is_verified = TRUE
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. SUBMIT A NEW MILF PIN (by a Hunter)
app.post('/api/profiles', authenticateToken, upload.single('proof'), async (req, res) => {
  const { name, description, lat, lng } = req.body;
  const userId = req.user.id;
  const proofImagePath = req.file.path; // This will be a URL to S3 in production

  // Insert into DB. `is_verified` is FALSE by default.
  const query = `
    INSERT INTO profiles (name, description, location, proof_image_url, created_by)
    VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, $6)
    RETURNING *
  `;
  const values = [name, description, lng, lat, proofImagePath, userId]; // Note: PostGIS uses (LONG, LAT)

  // Execute query and return result
});

// 5. CLAIM A PROFILE (by a MILF)
// This is complex. You might send an email with a unique link to the MILF.
// When they click it, they register/login and then a process connects their user_id to the existing profile, after verifying their proof.

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});