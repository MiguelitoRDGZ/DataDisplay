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
        <strong>${task.date}</strong> – ${task.customer} 
        <br>Assigned to: ${task.assignTo}
        <br>Review Platform: ${task.reviewPlatform}
        <br><a href="${task.reviewLink}" target="_blank">${task.reviewLink}</a>
        <br>Approach Confirmed: ${task.approachConfirmed}
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
