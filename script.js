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
}
