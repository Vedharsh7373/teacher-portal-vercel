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
async function getSubmissions(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { teacherId, date } = req.query;
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Submissions!A2:G100',
    });
    const rows = result.data.values || [];
    const entries = rows.filter(row => row[0] == teacherId && row[5] == date);
    res.status(200).json({ success: true, entries: entries.map(row => ({
      date: row[5],
      student: row[1],
      subject: row[2],
      chapter: row[3],
      workDone: row[4],
    })) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
async function addSubmission(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { teacherDisplay, student, subject, chapter, workDone, date } = req.body;
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Submissions!A:G',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [['', student, subject, chapter, workDone, date, teacherDisplay]],
      },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
export default async (req, res) => {
  if (req.method === 'GET') return getSubmissions(req, res);
  if (req.method === 'POST') return addSubmission(req, res);
  res.status(405).json({ error: 'Method not allowed' });
};
