# Teacher Entry Portal

A Vercel-hosted Teacher Entry Portal web application with an Express.js backend connected to Google Sheets.

## Features

- Teacher login with PIN-based authentication
- View assigned students
- Submit work entries (homework, tests, projects, assignments) with marks
- Red and white color scheme
- Responsive design
- CORS-enabled backend
- Google Sheets integration for data storage

## Project Structure

```
.
├── api/
│   └── server.js           # Express backend with API endpoints
├── public/
│   ├── index.html          # Frontend HTML
│   ├── styles.css          # Styling (red/white theme)
│   └── script.js           # Frontend JavaScript logic
├── package.json            # Node.js dependencies
├── vercel.json             # Vercel configuration
├── .gitignore              # Git ignore rules
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Google Cloud Project with Sheets API enabled
- Google Sheets with teacher data
- Vercel account
- GitHub account

### Installation

1. Clone the repository
```bash
git clone https://github.com/Vedharsh7373/teacher-portal-vercel.git
cd teacher-portal-vercel
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```
SHEET_ID=your_google_sheet_id
GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account.json
```

### Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## API Endpoints

- `GET /api/teachers` - Get all teachers
- `POST /api/authenticate` - Authenticate teacher
- `GET /api/students/:teacherId` - Get students for teacher
- `POST /api/submit` - Submit work entry

## Technology Stack

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Express.js, Node.js
- Database: Google Sheets
- Hosting: Vercel
- Authentication: Google Sheets API

## License

MIT
