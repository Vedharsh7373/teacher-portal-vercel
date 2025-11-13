const API_BASE = '/api';
let currentTeacher = null;
let teachers = [];

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const teacherId = document.getElementById('teacherId').value;
  const pin = document.getElementById('pin').value;
  
  try {
    const res = await fetch(`${API_BASE}/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: teacherId, pin })
    });
    
    if (res.ok) {
      const teacher = teachers.find(t => t.id === teacherId && t.pin === pin);
      if (teacher) {
        currentTeacher = teacher;
        showPortal();
      } else {
        showError('Invalid credentials');
      }
    } else {
      showError('Authentication failed');
    }
  } catch (err) {
    showError('Error: ' + err.message);
  }
});

async function loadTeachers() {
  try {
    const res = await fetch(`${API_BASE}/teachers`);
    if (res.ok) {
      teachers = await res.json();
    }
  } catch (err) {
    console.error('Error loading teachers:', err);
  }
}

async function loadStudents() {
  if (!currentTeacher) return;
  try {
    const res = await fetch(`${API_BASE}/students/${currentTeacher.id}`);
    if (res.ok) {
      const students = await res.json();
      renderStudents(students);
    }
  } catch (err) {
    console.error('Error loading students:', err);
  }
}

function renderStudents(students) {
  const list = document.getElementById('studentsList');
  const select = document.getElementById('studentSelect');
  list.innerHTML = '';
  select.innerHTML = '';
  
  students.forEach(student => {
    const div = document.createElement('div');
    div.className = 'student-item';
    div.textContent = student.name;
    list.appendChild(div);
    
    const option = document.createElement('option');
    option.value = student.id;
    option.textContent = student.name;
    select.appendChild(option);
  });
}

function showPortal() {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('portalSection').style.display = 'block';
  document.getElementById('teacherName').textContent = currentTeacher.name;
  loadStudents();
}

function showError(msg) {
  document.getElementById('errorMsg').textContent = msg;
}

function logout() {
  currentTeacher = null;
  document.getElementById('authSection').style.display = 'block';
  document.getElementById('portalSection').style.display = 'none';
  document.getElementById('loginForm').reset();
  document.getElementById('errorMsg').textContent = '';
}

document.getElementById('submitForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentId = document.getElementById('studentSelect').value;
  const workType = document.getElementById('workType').value;
  const marks = document.getElementById('marks').value;
  
  try {
    const res = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId: currentTeacher.id, studentId, workType, marks })
    });
    
    if (res.ok) {
      alert('Submission successful!');
      document.getElementById('submitForm').reset();
    } else {
      alert('Submission failed');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
});

window.addEventListener('load', () => {
  loadTeachers();
});
