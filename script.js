function openAssignPopup(button) {
  document.getElementById('assignPopup').classList.add('active');
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
    
    const agentDiv = document.createElement('div');
    agentDiv.className = 'agent-info';
    agentDiv.innerHTML = `
      <i class="fas fa-user-check" style="color: var(--lh-blue);"></i>
      <span>${selectedAgent}</span>
    `;
    
    button.parentNode.replaceChild(agentDiv, button);
    closeAssignPopup();
  } else {
    alert('Please select an agent first');
  }
}

document.getElementById('assignPopup').addEventListener('click', function(e) {
  if (e.target === this) {
    closeAssignPopup();
  }
});

// Add click handlers for action buttons
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const action = this.title;
    const customerName = this.closest('tr').querySelector('td:first-child strong').textContent;
    
    if (action === 'Delete') {
      if (confirm(`Are you sure you want to delete the review from ${customerName}?`)) {
        this.closest('tr').remove();
      }
    } else {
      alert(`${action} action for ${customerName}`);
      // In a real app, this would open a detail view or edit form
    }
  });
});