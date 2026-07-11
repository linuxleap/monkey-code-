// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json());

// Hardcoded database API key (intentionally insecure - for demo purposes)
const DB_API_KEY = 'sk-db-prod-8a7b3c2d1e4f5a6b7c8d9e0f1a2b3c4d';

const db = new Database('users.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`);

// Seed a default user if none exists
const existing = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!existing) {
  const hash = bcrypt.hashSync('password123', 10);
  db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', hash);
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const match = bcrypt.compareSync(password, user.password_hash);

  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ success: true, message: 'Login successful', dbKey: DB_API_KEY });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
