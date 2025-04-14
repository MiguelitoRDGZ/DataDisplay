const departmentSelect = document.getElementById('departmentSelect');
const agentSelect = document.getElementById('agentSelect');
const weekSelect = document.getElementById('weekSelect');
const output = document.getElementById('selectedAgentOutput');
const kpiContainer = document.getElementById('kpiContainer');
const kpiTableBody = document.getElementById('kpiTableBody');

// Simulated login role
const loggedInManagerDepartment = "Brand Management";

// Sample agents per department
const departmentAgents = {
  "Brand Management": ["Mike Rodriguez", "Elena Cruz", "Jorge Martinez"],
  "Customer Service": ["Samantha Lee", "Alicia Grant", "Lucas Ford"],
  "Marketing": ["David Kim", "Tina Nguyen", "Carlos Ramirez"]
};

// Sample KPI data
const kpiData = {
  "Mike Rodriguez": [
    {
      week: "Apr 1 - Apr 7",
      assigned: 20,
      accomplished: 18,
      rate: "90%",
      scheduled: 40,
      worked: 38,
      late: 2,
      score: "85%",
      slacks: 10,
      contacts: 50,
      incoming: 30,
      outbound: 20,
      npt: "1h",
      aht: "7m",
      missed: 2,
      totalAvail: "32h",
      avgAvail: "4h",
      hrsWorked: "38h",
      availVsWorked: "84%",
      feedback: "Great week!"
    },
    {
      week: "Apr 8 - Apr 14",
      assigned: 25,
      accomplished: 24,
      rate: "96%",
      scheduled: 40,
      worked: 39,
      late: 1,
      score: "92%",
      slacks: 14,
      contacts: 55,
      incoming: 33,
      outbound: 22,
      npt: "50m",
      aht: "6m 30s",
      missed: 1,
      totalAvail: "34h",
      avgAvail: "4.25h",
      hrsWorked: "39h",
      availVsWorked: "87%",
      feedback: "Excellent improvement"
    }
  ]
};

window.addEventListener('DOMContentLoaded', () => {
  departmentSelect.value = loggedInManagerDepartment;
  departmentSelect.disabled = true;
  populateAgents(loggedInManagerDepartment);
});

function populateAgents(department) {
  agentSelect.innerHTML = '<option value="">-- Choose Agent --</option>';
  agentSelect.disabled = true;
  output.textContent = 'No agent selected';
  kpiContainer.style.display = 'none';
  weekSelect.disabled = true;
  weekSelect.innerHTML = '<option value="">-- All Weeks --</option>';

  const agents = departmentAgents[department];
  if (agents) {
    agents.forEach(agent => {
      const option = document.createElement('option');
      option.value = agent;
      option.textContent = agent;
      agentSelect.appendChild(option);
    });
    agentSelect.disabled = false;
  }
}

agentSelect.addEventListener('change', () => {
  const selected = agentSelect.value;
  output.textContent = selected
    ? `Showing KPI data for: ${selected}`
    : 'No agent selected';

  weekSelect.innerHTML = '<option value="">-- All Weeks --</option>';
  weekSelect.disabled = true;
  kpiTableBody.innerHTML = '';

  if (selected && kpiData[selected]) {
    const weeks = [...new Set(kpiData[selected].map(item => item.week))];
    weeks.forEach(week => {
      const option = document.createElement('option');
      option.value = week;
      option.textContent = week;
      weekSelect.appendChild(option);
    });

    weekSelect.disabled = false;
    renderKpiTable(kpiData[selected]);
    kpiContainer.style.display = 'block';
  } else {
    kpiContainer.style.display = 'none';
  }
});

weekSelect.addEventListener('change', () => {
  const selectedAgent = agentSelect.value;
  const selectedWeek = weekSelect.value;

  if (selectedAgent && kpiData[selectedAgent]) {
    const filtered = selectedWeek
      ? kpiData[selectedAgent].filter(item => item.week === selectedWeek)
      : kpiData[selectedAgent];

    renderKpiTable(filtered);
  }
});

function renderKpiTable(data) {
  kpiTableBody.innerHTML = '';
  data.forEach(week => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${week.week}</td>
      <td>${week.assigned}</td>
      <td>${week.accomplished}</td>
      <td>${week.rate}</td>
      <td>${week.scheduled}</td>
      <td>${week.worked}</td>
      <td>${week.late}</td>
      <td>${week.score}</td>
      <td>${week.slacks}</td>
      <td>${week.contacts}</td>
      <td>${week.incoming}</td>
      <td>${week.outbound}</td>
      <td>${week.npt}</td>
      <td>${week.aht}</td>
      <td>${week.missed}</td>
      <td>${week.totalAvail}</td>
      <td>${week.avgAvail}</td>
      <td>${week.hrsWorked}</td>
      <td>${week.availVsWorked}</td>
      <td>${week.feedback}</td>
    `;
    kpiTableBody.appendChild(row);
  });
}
