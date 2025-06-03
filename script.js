document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const addBtn = document.getElementById("addTaskBtn");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");

  const tasks = [];

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
        renderTasks(); // Re-render with updated styling
      });
    });
  }

  addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    data.status = "Pending"; // Automatically set status
    tasks.push(data);
    renderTasks();
    form.reset();
    modal.classList.add("hidden");
  });
});
