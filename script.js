document.addEventListener("DOMContentLoaded", () => {
    renderChart();
    loadData();
  });
  
  function switchTab(tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
    document.getElementById(tabName).classList.remove("hidden");
  
    document.querySelectorAll(".nav-button").forEach(btn => btn.classList.remove("active"));
    const btn = document.querySelector(`.nav-button[onclick="switchTab('${tabName}')"]`);
    if (btn) btn.classList.add("active");
  }
  
  function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("collapsed");
  }
  
  function clearData() {
    const fields = [
      "ccdStart", "ccdEnd", "customersAssigned", "reviews", "reviewRate",
      "slacks", "contacts", "incoming", "outbound", "holdTime",
      "scheduled", "worked", "late", "absent", "attendanceScore",
      "feedback", "errors"
    ];
  
    fields.forEach(id => document.getElementById(id).value = "");
    document.getElementById("teamMember").selectedIndex = 0;
    document.getElementById("month").selectedIndex = 0;
  
    localStorage.removeItem("kpiData");
    alert("Data Cleared");
  }
  
  function saveData() {
    const data = {};
    document.querySelectorAll("input, textarea, select").forEach(el => {
      data[el.id] = el.value;
    });
    localStorage.setItem("kpiData", JSON.stringify(data));
  }
  
  function loadData() {
    const data = JSON.parse(localStorage.getItem("kpiData"));
    if (data) {
      Object.keys(data).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = data[id];
      });
    }
  }
  
  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", saveData);
  });
  
  function renderChart() {
    const ctx = document.getElementById("kpiChart").getContext("2d");
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
          label: 'Review Rate (%)',
          data: [80, 75, 90, 85],
          backgroundColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#fff' } }
        },
        scales: {
          x: { ticks: { color: '#fff' }, grid: { color: '#444' } },
          y: { ticks: { color: '#fff' }, grid: { color: '#444' } }
        }
      }
    });
  }
  