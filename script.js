function switchTab(tabName) {
    const monthlyTab = document.getElementById("monthly");
    const weeklyTab = document.getElementById("weekly");
  
    // Hide/show tab content
    if (tabName === "monthly") {
      monthlyTab.classList.remove("hidden");
      weeklyTab.classList.add("hidden");
    } else {
      weeklyTab.classList.remove("hidden");
      monthlyTab.classList.add("hidden");
    }
  
    // Update active tab button style
    const buttons = document.querySelectorAll(".tab-button");
    buttons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.tab-button[onclick=\"switchTab('${tabName}')\"]`).classList.add("active");
  }
  
  function clearData() {
    const fields = [
      "ccdStart", "ccdEnd", "customersAssigned", "reviews", "reviewRate",
      "slacks", "contacts", "incoming", "outbound", "holdTime",
      "scheduled", "worked", "late", "absent", "attendanceScore",
      "feedback", "errors"
    ];
  
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  
    document.getElementById("teamMember").selectedIndex = 0;
    document.getElementById("month").selectedIndex = 0;
  }
  