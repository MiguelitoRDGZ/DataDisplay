let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let assigned = JSON.parse(localStorage.getItem('assigned') || '[]');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('assigned', JSON.stringify(assigned));
}

// ===================== ADD TASK =====================
const taskForm = document.getElementById('taskForm');
if (taskForm) {
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(taskForm);

    const task = {
      id: Date.now(),
      date: formData.get('date'),
      customer: formData.get('customer'),
      platform: formData.get('reviewPlatform'),
      link: formData.get('reviewLink'),
      status: 'Pending',
      approach: null,
      assignedTo: null
    };

    tasks.push(task);
    saveTasks();
    window.location.href = 'approaches.html';
  });
}

// ===================== APPROACHES PAGE =====================
const approachCards = document.getElementById('approachCards');
if (approachCards) {
  approachCards.innerHTML = '';
  tasks.filter(task => task.approach === null).forEach(task => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>${task.customer}</strong><br>
      Platform: ${task.platform}<br>
      <a href="${task.link}" target="_blank">Review Link</a><br>
      <button onclick="createApproach(${task.id})">Create Approach</button>
    `;
    approachCards.appendChild(div);
  });
}

function createApproach(taskId) {
  localStorage.setItem('currentApproachId', taskId);
  window.location.href = 'approach_form.html'; // if you have the form in another page
}

// ===================== LOGGED CASES =====================
const loggedList = document.getElementById('loggedList');
if (loggedList) {
  loggedList.innerHTML = '';
  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>${task.customer}</strong><br>
      Platform: ${task.platform}<br>
      <a href="${task.link}" target="_blank">${task.link}</a>
    `;
    loggedList.appendChild(div);
  });
}
