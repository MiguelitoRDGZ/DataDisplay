// Show/hide yearly plan options based on policy type
document.getElementById('policyType').addEventListener('change', function() {
  const yearlyPlanGroup = document.getElementById('yearlyPlanGroup');
  if (this.value === 'yearly') {
    yearlyPlanGroup.classList.remove('hidden');
  } else {
    yearlyPlanGroup.classList.add('hidden');
  }
});

// Form submission handler
document.getElementById('policyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  savePolicyDetails();
});

function openAssignPopup(button) {
  document.getElementById('assignPopup').classList.add('active');
  document.getElementById('assignPopup').currentButton = button;
  document.getElementById('policyForm').reset();
  document.getElementById('yearlyPlanGroup').classList.add('hidden');
  document.getElementById('responsePreview').classList.add('hidden');
}

function closeAssignPopup() {
  document.getElementById('assignPopup').classList.remove('active');
}

function previewResponse() {
  const policyType = document.getElementById('policyType').value;
  const yearlyPlan = policyType === 'yearly' ? document.getElementById('yearlyPlan').value + ' Year Plan' : '';
  const startDate = `${document.getElementById('policyMonth').value}/${document.getElementById('policyDay').value}/${document.getElementById('policyYear').value}`;
  
  const previewContent = `
    <p><strong>Policy Type:</strong> ${policyType === 'monthly' ? 'Monthly' : 'Yearly'} ${yearlyPlan}</p>
    <p><strong>Start Date:</strong> ${startDate}</p>
    <p><strong>Premiums Paid:</strong> $${document.getElementById('premiumsPaid').value}</p>
    <p><strong>PCFS:</strong> $${document.getElementById('pcfs').value}</p>
    <p><strong>Claim Expenses:</strong> $${document.getElementById('claimExpenses').value}</p>
    <p><strong>Amount In House:</strong> $${document.getElementById('amountInHouse').value}</p>
    <p><strong>Response Plan:</strong> ${document.getElementById('responsePlan').value}</p>
  `;
  
  document.getElementById('previewContent').innerHTML = previewContent;
  document.getElementById('responsePreview').classList.remove('hidden');
}

function savePolicyDetails() {
  const policyType = document.getElementById('policyType').value;
  const yearlyPlan = policyType === 'yearly' ? document.getElementById('yearlyPlan').value + ' Year Plan' : '';
  const startDate = `${document.getElementById('policyMonth').value}/${document.getElementById('policyDay').value}/${document.getElementById('policyYear').value}`;
  
  const responsePlan = document.getElementById('responsePlan').value;
  const assignedAgent = document.getElementById('agentDropdown').value;
  
  const popup = document.getElementById('assignPopup');
  const button = popup.currentButton;
  
  // Create the agent info display
  const agentDiv = document.createElement('div');
  agentDiv.className = 'agent-info';
  agentDiv.innerHTML = `
    <i class="fas fa-user-check" style="color: var(--lh-blue);"></i>
    <span>${assignedAgent}</span>
  `;
  
  // Replace the assign button with agent info
  button.parentNode.replaceChild(agentDiv, button);
  
  // Find the response plan textarea in the table row
  const row = button.closest('tr');
  const responseTextarea = row.querySelector('.approach-text');
  
  // Create the formatted response plan
  const formattedPlan = `Policy Details:
- Type: ${policyType === 'monthly' ? 'Monthly' : 'Yearly'} ${yearlyPlan}
- Start Date: ${startDate}
- Premiums Paid: $${document.getElementById('premiumsPaid').value}
- PCFS: $${document.getElementById('pcfs').value}
- Claim Expenses: $${document.getElementById('claimExpenses').value}
- Amount In House: $${document.getElementById('amountInHouse').value}

Response Plan:
${responsePlan}`;
  
  // Update the response plan textarea
  responseTextarea.value = formattedPlan;
  
  // Close the popup
  closeAssignPopup();
}

// Close popup when clicking outside
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

// Legacy confirmAssign function (kept for compatibility)
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