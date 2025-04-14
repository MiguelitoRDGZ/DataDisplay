function switchTab(tabName) {
    const tabs = ["monthly", "weekly"];
    tabs.forEach(tab => {
      document.getElementById(tab).classList.toggle("hidden", tab !== tabName);
    });
  
    const buttons = document.querySelectorAll(".nav-button");
    buttons.forEach(button => button.classList.remove("active"));
  
    const activeButton = [...buttons].find(btn => btn.textContent.includes(tabName === "monthly" ? "Monthly" : "Weekly"));
    if (activeButton) activeButton.classList.add("active");
  }
  
  function clearData() {
    const fieldIds = [
      "ccdStart", "ccdEnd", "customersAssigned", "reviews", "reviewRate",
      "slacks", "contacts", "incoming", "outbound", "holdTime",
      "scheduled", "worked", "late", "absent", "attendanceScore",
      "feedback", "errors"
    ];
  
    fieldIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) element.value = "";
    });
  
    document.getElementById("teamMember").selectedIndex = 0;
    document.getElementById("month").selectedIndex = 0;
  }
  