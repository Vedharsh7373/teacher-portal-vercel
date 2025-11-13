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
async function getStudents(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Students!A2:C100',
    });
    const rows = result.data.values || [];
    const students = {};
    rows.forEach((row) => {
      const teacherId = row[1] || '';
      const studentName = row[0] || '';
      if (studentName && teacherId) {
        if (!students[teacherId]) students[teacherId] = [];
        students[teacherId].push(studentName);
      }
    });
    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
async function addStudent(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { teacher, student } = req.body;
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Students!A:C',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[student, teacher, '']],
      },
    });
    res.status(200).json({ success: true, id: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
export default async (req, res) => {
  if (req.method === 'GET') return getStudents(req, res);
  if (req.method === 'POST') return addStudent(req, res);
  res.status(405).json({ error: 'Method not allowed' });
};
