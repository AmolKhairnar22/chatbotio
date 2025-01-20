const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL Database Connection
const client = new Client({
  user: 'postgres', // Replace with your username
  host: 'localhost',
  database: 'postgres', // Replace with your database name
  password: 'Amol', // Replace with your password
  port: 5432,
});

client.connect().then(() => {
  console.log('Connected to PostgreSQL');
}).catch((err) => {
  console.error('Failed to connect to PostgreSQL:', err);
});

// Retrieve Messages (with optional filtering)
app.get('/get-messages', async (req, res) => {
  const { sender, keyword } = req.query; // Extract optional filters
  try {
    let query = 'SELECT * FROM messages';
    const params = [];
    const conditions = [];

    if (sender) {
      conditions.push('sender = $' + (params.length + 1));
      params.push(sender);
    }

    if (keyword) {
      conditions.push('message ILIKE $' + (params.length + 1));
      params.push(`%${keyword}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY timestamp ASC';

    const result = await client.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving messages:', err);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

// Send a New Message
app.post('/send-message', async (req, res) => {
  const { sender, message } = req.body;
  try {
    await client.query('INSERT INTO messages (sender, message) VALUES ($1, $2)', [sender, message]);
    res.status(200).json({ success: 'Message sent successfully' });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
