const { google } = require('googleapis');

const sheetId = process.env.GS_SHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GS_CLIENT_EMAIL,
    private_key: process.env.GS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// GET all teachers
async function getTeachers(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Teachers!A2:D100',
    });
    const rows = result.data.values || [];
    const teachers = {};
    rows.forEach((row, idx) => {
      teachers[idx + 1] = {
        id: idx + 1,
        display: row[0] || '',
        subjects: (row[1] || '').split(',').map(s => s.trim()),
        pin: row[2] || '',
        students: [],
      };
    });
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// POST add teacher
async function addTeacher(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    const { display, subjects, pin } = req.body;
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Teachers!A:D',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[display, subjects.join(','), pin, '']],
      },
    });
    res.status(200).json({ success: true, id: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export default async (req, res) => {
  if (req.method === 'GET') return getTeachers(req, res);
  if (req.method === 'POST') return addTeacher(req, res);
  res.status(405).json({ error: 'Method not allowed' });
};
