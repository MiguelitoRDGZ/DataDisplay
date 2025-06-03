document.addEventListener("DOMContentLoaded", () => {
  // TASK MODAL
  const modal = document.getElementById("modal");
  const addBtn = document.getElementById("addTaskBtn");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const tasks = [];

  // STATUS BADGE COLOR CLASS
  function statusClass(status) {
    switch (status) {
      case "Pending": return "status-pending";
      case "Success": return "status-success";
      case "Unable to Reach": return "status-unreachable";
      case "Re-Evaluate later": return "status-reeval";
      case "Removed": return "status-removed";
      case "Loss": return "status-loss";
      default: return "";
    }
  }

  // RENDER TASKS
  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const div = document.createElement("div");
      div.className = "task-card";
      div.innerHTML = `
        <div class="task-header">
          <div>
            <span class="task-date">${task.date}</span>
            <span class="task-customer">${task.customer}</span>
          </div>
          <select class="task-status-dropdown ${statusClass(task.status)}">
            ${["Pending", "Success", "Unable to Reach", "Re-Evaluate later", "Removed", "Loss"].map(option => `
              <option value="${option}" ${task.status === option ? "selected" : ""}>${option}</option>
            `).join("")}
          </select>
        </div>
        <div class="task-details">
          <p><strong>Assigned to:</strong> ${task.assignTo}</p>
          <p><strong>Review Platform:</strong> ${task.reviewPlatform}</p>
          ${task.reviewLink ? `<p><strong>Review Link:</strong> <a href="${task.reviewLink}" target="_blank">Open Link</a></p>` : ''}
          <p><strong>Approach Confirmed:</strong> ${task.approachConfirmed}</p>
        </div>
      `;
      taskList.appendChild(div);

      const statusDropdown = div.querySelector(".task-status-dropdown");
      statusDropdown.addEventListener("change", (e) => {
        task.status = e.target.value;
        renderTasks();
      });
    });
  }

  addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    data.status = "Pending";
    tasks.push(data);
    renderTasks();
    form.reset();
    modal.classList.add("hidden");
  });

  // APPROACH MODAL
  const approachModal = document.getElementById("approachModal");
  const openApproachBtn = document.getElementById("openApproachBtn");
  const closeApproachModal = document.getElementById("closeApproachModal");
  const premiumType = document.getElementById("premiumType");
  const customPremium = document.getElementById("customPremium");
  const totalPaidSpan = document.getElementById("totalPaid");
  const inHouseSpan = document.getElementById("inHouseAmount");
  const claimsSection = document.getElementById("claimsSection");
  const addClaim = document.getElementById("addClaim");
  const approachForm = document.getElementById("approachForm");

  openApproachBtn.addEventListener("click", () => approachModal.classList.remove("hidden"));
  closeApproachModal.addEventListener("click", () => approachModal.classList.add("hidden"));

  premiumType.addEventListener("change", () => {
    if (premiumType.value === "custom") {
      customPremium.classList.remove("hidden");
    } else {
      customPremium.classList.add("hidden");
    }
    updateTotals();
  });

  approachForm.addEventListener("input", updateTotals);
  addClaim.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "claim-row";
    row.innerHTML = `
      <input type="text" placeholder="Claim Description" class="claim-desc" />
      <input type="number" placeholder="$ Amount" class="claim-amount" />
    `;
    claimsSection.appendChild(row);
  });

  function updateTotals() {
    const agreementPrice = parseFloat(approachForm.agreementPrice.value) || 0;
    const premium = premiumType.value === "same"
      ? agreementPrice
      : parseFloat(customPremium.value) || 0;
    const pcfs = parseFloat(approachForm.pcfsPaid.value) || 0;
    const totalPaid = premium + pcfs;
    totalPaidSpan.textContent = totalPaid.toFixed(2);

    // Calculate total claims
    const amounts = [...document.querySelectorAll(".claim-amount")];
    const claimTotal = amounts.reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
    const inHouse = totalPaid - claimTotal;
    inHouseSpan.textContent = inHouse.toFixed(2);
  }

  approachForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Approach saved! (This is placeholder. Hook to database next.)");
    approachForm.reset();
    totalPaidSpan.textContent = "0.00";
    inHouseSpan.textContent = "0.00";
    claimsSection.innerHTML = `
      <label>Claim Expenses:</label>
      <div class="claim-row">
        <input type="text" placeholder="Claim Description" class="claim-desc" />
        <input type="number" placeholder="$ Amount" class="claim-amount" />
      </div>
    `;
    approachModal.classList.add("hidden");
  });
});
