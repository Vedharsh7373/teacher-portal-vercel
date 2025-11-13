const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../public'));

const SHEET_ID = process.env.SHEET_ID;
const AUTH = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth: AUTH });

// Get all teachers
app.get('/api/teachers', async (req, res) => {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Teachers!A2:D100'
    });
    const rows = result.data.values || [];
    const teachers = rows.map(row => ({
      id: row[0],
      name: row[1],
      subject: row[2],
      pin: row[3]
    }));
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authenticate teacher
app.post('/api/authenticate', (req, res) => {
  const { id, pin } = req.body;
  // Validation will be done in frontend
  res.json({ success: true });
});

// Get students for teacher
app.get('/api/students/:teacherId', async (req, res) => {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Students!A2:C100'
    });
    const rows = result.data.values || [];
    const students = rows.filter(row => row[1] === req.params.teacherId)
      .map(row => ({ id: row[0], name: row[1], teacher: row[2] }));
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit work entry
app.post('/api/submit', async (req, res) => {
  const { teacherId, studentId, workType, marks } = req.body;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${teacherId}!A:D`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[new Date().toISOString(), studentId, workType, marks]]
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
