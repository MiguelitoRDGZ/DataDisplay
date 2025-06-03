let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let assigned = JSON.parse(localStorage.getItem('assigned') || '[]');
localStorage.setItem('tasks', JSON.stringify(tasks)); // Ensure sync

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
    localStorage.setItem('tasks', JSON.stringify(tasks));
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
      <div class="card-header">
        <div class="card-title">${task.customer}</div>
        <div class="card-date">${task.date}</div>
      </div>
      <p><strong>Platform:</strong> ${task.platform}</p>
      <p><a href="${task.link}" target="_blank">Review Link</a></p>
      <div class="card-actions">
        <button onclick="openApproachModal(${task.id})">Create Approach</button>
      </div>
    `;
    approachCards.appendChild(div);
  });
}

// ========== MODAL ==========
const modal = document.getElementById('approachModal');
const modalForm = document.getElementById('approachForm');
let currentTaskId = null;

window.openApproachModal = (id) => {
  currentTaskId = id;
  document.getElementById('claimsList').innerHTML = ''; // Reset claims
  modal.classList.remove('hidden');
};

document.getElementById('closeModal').addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Add dynamic claims
document.getElementById('addClaim').addEventListener('click', () => {
  const div = document.createElement('div');
  div.innerHTML = `
    <input type="text" placeholder="Claim Description" class="claimDesc" />
    <input type="number" placeholder="Amount" class="claimAmount" />
  `;
  document.getElementById('claimsList').appendChild(div);
});

// Save approach
modalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(modalForm);
  const task = tasks.find(t => t.id === currentTaskId);
  const price = parseFloat(formData.get('agreementPrice'));
  const same = formData.get('premiumsPaid') === 'same';
  const premiums = same ? price : parseFloat(formData.get('customPremiums'));
  const pcfs = parseFloat(formData.get('pcfsPaid'));
  const total = premiums + pcfs;

  const claimDescs = document.querySelectorAll('.claimDesc');
  const claimAmounts = document.querySelectorAll('.claimAmount');
  let claimItems = [];
  let totalClaims = 0;

  for (let i = 0; i < claimDescs.length; i++) {
    const desc = claimDescs[i].value;
    const amt = parseFloat(claimAmounts[i].value || 0);
    if (desc && amt) {
      claimItems.push({ desc, amt });
      totalClaims += amt;
    }
  }

  const inHouse = total - totalClaims;

  task.approach = {
    type: formData.get('policyType'),
    length: formData.get('policyLength'),
    price,
    startDate: formData.get('startDate'),
    premiums,
    pcfs,
    total,
    claims: claimItems,
    inHouse,
    text: formData.get('approachText')
  };

  const agent = prompt("Assign this case to: (e.g. Tiffany Moore)");
  if (agent) {
    task.assignedTo = agent;
    assigned.push(task);
    tasks = tasks.filter(t => t.id !== task.id); // remove from pending
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('assigned', JSON.stringify(assigned));
    modal.classList.add('hidden');
    location.reload();
  }
});
