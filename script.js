document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const addBtn = document.getElementById("addTaskBtn");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");

  const tasks = [];

  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const div = document.createElement("div");
      div.className = "task-card";
      div.innerHTML = `
        <div class="task-header">
          <span class="task-date">${task.date}</span>
          <span class="task-customer">${task.customer}</span>
        </div>
        <div class="task-details">
          <p><strong>Assigned to:</strong> ${task.assignTo}</p>
          <p><strong>Review Platform:</strong> ${task.reviewPlatform}</p>
          ${task.reviewLink ? `<p><strong>Review Link:</strong> <a href="${task.reviewLink}" target="_blank">Open Link</a></p>` : ''}
          <p><strong>Approach Confirmed:</strong> ${task.approachConfirmed}</p>
        </div>
      `;
      taskList.appendChild(div);
    });
  }

  addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    tasks.push(data);
    renderTasks();
    form.reset();
    modal.classList.add("hidden");
  });
});
