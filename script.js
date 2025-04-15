function openAssignPopup(button) {
  document.getElementById('assignPopup').classList.add('active');
  // Store reference to the button that opened the popup
  document.getElementById('assignPopup').currentButton = button;
}

function closeAssignPopup() {
  document.getElementById('assignPopup').classList.remove('active');
}

function confirmAssign() {
  const agentDropdown = document.getElementById('agentDropdown');
  const selectedAgent = agentDropdown.value;
  
  if (selectedAgent && selectedAgent !== 'Select an agent...') {
    const popup = document.getElementById('assignPopup');
    const button = popup.currentButton;
    
    // Create a new span to show the assigned agent
    const agentSpan = document.createElement('span');
    agentSpan.className = 'assigned-agent';
    agentSpan.textContent = selectedAgent;
    
    // Replace the button with the span
    button.parentNode.replaceChild(agentSpan, button);
    
    closeAssignPopup();
  } else {
    alert('Please select an agent first');
  }
}

// Close popup when clicking outside
document.getElementById('assignPopup').addEventListener('click', function(e) {
  if (e.target === this) {
    closeAssignPopup();
  }
});