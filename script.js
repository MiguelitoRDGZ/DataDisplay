// GLOBAL TASK STORAGE
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let assignedCases = JSON.parse(localStorage.getItem('assignedCases') || '[]');
let completedCases = JSON.parse(localStorage.getItem('completedCases') || '[]');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('assignedCases', JSON.stringify(assignedCases));
}

// ---------- ADD TASK (index.html) ----------
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

// ---------- APPROACHES PENDING (approaches.html) ----------
const approachCards = document.getElementById('approachCards');
if (approachCards) {
  renderApproachCards();

  function renderApproachCards() {
    approachCards.innerHTML = '';
    const pending = tasks.filter(t => !t.approach);
    if (pending.length === 0) {
      approachCards.innerHTML = '<p>No pending approaches.</p>';
    }

    pending.forEach(task => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <h3>${task.customer}</h3>
        <p><strong>Date:</strong> ${task.date}</p>
        <p><strong>Platform:</strong> ${task.platform}</p>
        <p><a href="${task.link}" target="_blank">Review Link</a></p>
        <div class="card-actions">
          <button onclick="startApproach(${task.id})">Create Approach</button>
        </div>
      `;
      approachCards.appendChild(div);
    });
  }

  window.startApproach = function(id) {
    localStorage.setItem('currentApproach', id);
    window.location.href = 'approach_form.html'; // Optional: or load a modal
  };
}

// ---------- ASSIGNED CASES (assigned.html) ----------
const assignedList = document.getElementById('assignedCases');
if (assignedList) {
  renderAssignedCases();

  function renderAssignedCases() {
    assignedList.innerHTML = '';
    assignedCases.forEach(caseItem => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <h3>${caseItem.customer}</h3>
        <p><strong>Date:</strong> ${caseItem.date}</p>
        <p><strong>Assigned To:</strong> ${caseItem.assignedTo}</p>
        <p><strong>Status:</strong>
          <select onchange="updateStatus(${caseItem.id}, this.value)">
            ${['Pending','Success','Unable to Reach','Re-Evaluate later','Removed','Loss'].map(status => `
              <option value="${status}" ${caseItem.status === status ? 'selected' : ''}>${status}</option>
            `).join('')}
          </select>
        </p>
      `;
      assignedList.appendChild(div);
    });
  }

  window.updateStatus = function(id, newStatus) {
    const item = assignedCases.find(c => c.id === id);
    if (item) {
      item.status = newStatus;
      saveTasks();
      renderAssignedCases();
    }
  };
}

// ---------- LOGGED CASES (logged.html) ----------
const loggedList = document.getElementById('loggedList');
if (loggedList) {
  loggedList.innerHTML = '';
  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${task.customer}</h3>
      <p><strong>Date:</strong> ${task.date}</p>
      <p><strong>Platform:</strong> ${task.platform}</p>
      <p><a href="${task.link}" target="_blank">Review Link</a></p>
    `;
    loggedList.appendChild(div);
  });
}
