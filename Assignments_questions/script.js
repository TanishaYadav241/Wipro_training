// Store registered users
let users = [];

// Sample Monthly Activities
const activities = [
  { id: 1, activity: "Create project file which contains tables between 12 to 19", subject: "Maths" },
  { id: 2, activity: "Complete science experiment on water cycle", subject: "Science" },
  { id: 3, activity: "Write an essay about your favorite season", subject: "English" },
  { id: 4, activity: "Solve 20 geometry problems", subject: "Maths" },
  { id: 5, activity: "Prepare for science quiz", subject: "Science" },
  { id: 6, activity: "Read chapter on World War II", subject: "Social Science" },
  { id: 7, activity: "Practice Hindi vocabulary", subject: "Hindi" },
  { id: 8, activity: "Practice Hindi Grammar", subject: "Hindi" },
  { id: 9, activity: "Complete Social Science project on Indian History", subject: "Social Science" }
];

function showRegister() {
  showPage('registerPage');
}

function showLogin() {
  showPage('loginPage');
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function register() {
  const username = document.getElementById('newUsername').value.trim();
  const password = document.getElementById('newPassword').value.trim();

  if (!username || !password) {
    alert('Please fill all fields');
    return;
  }

  users.push({ username, password });
  alert('Registration successful! You can now login.');
  showLogin();
}

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const validUser = users.find(u => u.username === username && u.password === password);

  if (validUser) {
    document.getElementById('displayUser').innerText = username;
    showPage('welcomePage');
  } else {
    alert('Invalid credentials! Please register first.');
  }
}

function logout() {
  showPage('loginPage');
}

function showMonthly() {
  showPage('monthlyPage');
}

function goBack() {
  showPage('welcomePage');
}

function showActivities() {
  const subject = document.getElementById('subjectSelect').value;
  const list = document.getElementById('activityList');
  list.innerHTML = '';

  if (!subject) return;

  const filtered = activities.filter(a => a.subject === subject);

  if (filtered.length === 0) {
    list.innerHTML = `<p>No activities found for ${subject}</p>`;
  } else {
    filtered.forEach(a => {
      list.innerHTML += `<p>📝 ${a.activity}</p>`;
    });
  }
}
