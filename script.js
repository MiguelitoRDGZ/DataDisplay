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
// ---------- APPROACH FORM (approach_form.html) ----------
const approachForm = document.getElementById("approachForm");
const premiumType = document.getElementById("premiumType");
const customPremium = document.getElementById("customPremium");
const totalPaidSpan = document.getElementById("totalPaid");
const inHouseSpan = document.getElementById("inHouseAmount");
const claimsSection = document.getElementById("claimsSection");
const addClaim = document.getElementById("addClaim");

if (approachForm) {
  const approachId = parseInt(localStorage.getItem("currentApproach"));
  const task = tasks.find(t => t.id === approachId);

  if (!task) {
    alert("Task not found.");
    window.location.href = "approaches.html";
  }

  premiumType.addEventListener("change", () => {
    customPremium.classList.toggle("hidden", premiumType.value !== "custom");
    updateTotals();
  });

  addClaim.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "claim-row";
    row.innerHTML = `
      <input type="text" placeholder="Claim Description" class="claim-desc" />
      <input type="number" placeholder="$ Amount" class="claim-amount" />
    `;
    claimsSection.appendChild(row);
  });

  approachForm.addEventListener("input", updateTotals);

  function updateTotals() {
    const agreement = parseFloat(approachForm.agreementPrice.value) || 0;
    const pcfs = parseFloat(approachForm.pcfsPaid.value) || 0;
    const premium = premiumType.value === "custom"
      ? parseFloat(customPremium.value) || 0
      : agreement;

    const totalPaid = premium + pcfs;
    totalPaidSpan.textContent = totalPaid.toFixed(2);

    const claimAmounts = [...document.querySelectorAll(".claim-amount")];
    const totalClaims = claimAmounts.reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
    const inHouse = totalPaid - totalClaims;
    inHouseSpan.textContent = inHouse.toFixed(2);
  }

  approachForm.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(approachForm);

    const agreement = parseFloat(formData.get("agreementPrice")) || 0;
    const pcfs = parseFloat(formData.get("pcfsPaid")) || 0;
    const premium = formData.get("premiumType") === "custom"
      ? parseFloat(formData.get("customPremium")) || 0
      : agreement;

    const claimDescs = [...document.querySelectorAll(".claim-desc")].map(el => el.value);
    const claimAmts = [...document.querySelectorAll(".claim-amount")].map(el => parseFloat(el.value) || 0);
    const claims = claimDescs.map((desc, i) => ({
      desc,
      amount: claimAmts[i]
    }));

    const totalPaid = premium + pcfs;
    const totalClaims = claimAmts.reduce((a, b) => a + b, 0);
    const inHouse = totalPaid - totalClaims;

    // Save approach data
    task.approach = {
      policyType: formData.get("policyType"),
      agreementPrice: agreement,
      startDate: formData.get("startDate"),
      premiumType: formData.get("premiumType"),
      customPremium: premiumType.value === "custom" ? premium : "same",
      pcfsPaid: pcfs,
      totalPaid,
      claims,
      inHouse,
      approachText: formData.get("approachText")
    };

    task.assignedTo = formData.get("assignTo");
    task.status = "Pending";

    // Move to assignedCases
    assignedCases.push(task);
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();

    alert("Approach saved and assigned!");
    window.location.href = "assigned.html";
  });
}
