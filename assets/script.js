// Storage Keys
const LOGGED_CASES_KEY = 'agenda_logged_cases';
const APPROACHES_KEY = 'agenda_approaches_pending';
const ASSIGNED_KEY = 'agenda_cases_assigned';

// Utility Functions
function generateID() {
  return 'CASE-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 10000);
}
function saveToStorage(key, newEntry) {
  const existing = JSON.parse(localStorage.getItem(key)) || [];
  existing.push(newEntry);
  localStorage.setItem(key, JSON.stringify(existing));
}
function removeFromStorage(key, id) {
  const data = JSON.parse(localStorage.getItem(key)) || [];
  const updated = data.filter(entry => entry.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
}

// ADD CASE PAGE
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('caseForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const caseDate = document.getElementById('caseDate').value;
      const customerName = document.getElementById('customerName').value.trim();
      const reviewLink = document.getElementById('reviewLink').value.trim();
      const platformSelect = document.getElementById('reviewPlatform');
      const platforms = Array.from(platformSelect.selectedOptions).map(opt => opt.value);

      const newCase = {
        id: generateID(),
        date: caseDate,
        customer: customerName,
        platforms: platforms,
        reviewLink: reviewLink,
        status: 'Pending',
        approach: null,
        assignedTo: null
      };

      saveToStorage(LOGGED_CASES_KEY, newCase);
      saveToStorage(APPROACHES_KEY, newCase);
      alert('Case added!');
      form.reset();
    });
  }

  // APPROACHES PAGE
  const cardsContainer = document.getElementById('approachCards');
  const modal = document.getElementById('approachModal');
  const closeBtn = document.getElementById('closeApproachModal');
  const approachForm = document.getElementById('approachForm');
  const policyType = document.getElementById('policyType');
  const policyLength = document.getElementById('policyLength');
  const lengthContainer = document.getElementById('policyLengthContainer');
  const premiumOption = document.getElementById('premiumOption');
  const customPremium = document.getElementById('customPremium');
  const agreementPrice = document.getElementById('agreementPrice');
  const pcfsPaid = document.getElementById('pcfsPaid');
  const totalPaid = document.getElementById('totalPaid');
  const weHaveInHouse = document.getElementById('weHaveInHouse');
  const claimList = document.getElementById('claimList');
  const addClaimBtn = document.getElementById('addClaimBtn');
  let selectedCaseId = null;

  if (cardsContainer) {
    const data = JSON.parse(localStorage.getItem(APPROACHES_KEY)) || [];
    cardsContainer.innerHTML = '';
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">${item.customer}</h3>
          <span class="card-date">${item.date}</span>
        </div>
        <div class="card-content">
          <p><strong>Platforms:</strong> ${item.platforms.join(', ')}</p>
          <p><a href="${item.reviewLink}" target="_blank">Review Link</a></p>
          <p><span class="status-badge status-pending">Pending</span></p>
        </div>
        <div class="card-actions">
          <button onclick="openApproachForm('${item.id}')">Create Approach</button>
        </div>
      `;
      cardsContainer.appendChild(card);
    });
  }

  window.openApproachForm = function (id) {
    selectedCaseId = id;
    modal.classList.remove('hidden');
  };
  if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');

  if (policyType) {
    policyType.onchange = () => {
      lengthContainer.classList.toggle('hidden', policyType.value !== 'Yearly');
    };
    premiumOption.onchange = () => {
      customPremium.classList.toggle('hidden', premiumOption.value !== 'custom');
    };
    addClaimBtn.onclick = () => {
      const div = document.createElement('div');
      div.className = 'claim-row';
      div.innerHTML = `
        <input type="text" placeholder="Description" class="claim-desc">
        <input type="number" placeholder="Amount" class="claim-amount">
      `;
      claimList.appendChild(div);
    };

    function calculateTotals() {
      const premiumVal = premiumOption.value === 'same'
        ? parseFloat(agreementPrice.value || 0)
        : parseFloat(customPremium.value || 0);
      const pcfsVal = parseFloat(pcfsPaid.value || 0);
      const total = premiumVal + pcfsVal;

      const claimAmounts = Array.from(document.querySelectorAll('.claim-amount'))
        .map(input => parseFloat(input.value || 0));
      const totalClaims = claimAmounts.reduce((a, b) => a + b, 0);

      totalPaid.value = `$${total.toFixed(2)}`;
      weHaveInHouse.value = `$${(total - totalClaims).toFixed(2)}`;
    }

    agreementPrice.oninput = calculateTotals;
    customPremium.oninput = calculateTotals;
    pcfsPaid.oninput = calculateTotals;
    claimList.oninput = calculateTotals;

    approachForm.onsubmit = (e) => {
      e.preventDefault();

      const data = JSON.parse(localStorage.getItem(APPROACHES_KEY)) || [];
      const idx = data.findIndex(c => c.id === selectedCaseId);
      if (idx === -1) return;

      const task = data[idx];
      const premiumsPaid = premiumOption.value === 'same'
        ? parseFloat(agreementPrice.value)
        : parseFloat(customPremium.value || 0);

      task.approach = {
        policyType: policyType.value,
        policyLength: policyType.value === 'Yearly' ? policyLength.value : null,
        agreementPrice: parseFloat(agreementPrice.value),
        startDate: document.getElementById('startDate').value,
        premiumsPaid: premiumsPaid,
        pcfsPaid: parseFloat(pcfsPaid.value),
        totalPaid: premiumsPaid + parseFloat(pcfsPaid.value),
        claims: Array.from(document.querySelectorAll('.claim-row')).map(row => ({
          desc: row.querySelector('.claim-desc').value,
          amount: parseFloat(row.querySelector('.claim-amount').value || 0)
        })),
        weHaveInHouse: parseFloat(weHaveInHouse.value.replace('$', '')),
        approachText: document.getElementById('ourApproach').value
      };

      const agent = prompt("Assign this to an agent:");
      if (!agent) return;

      task.assignedTo = agent;
      task.status = "Pending";
      saveToStorage(ASSIGNED_KEY, task);
      removeFromStorage(APPROACHES_KEY, task.id);

      alert("Case assigned!");
      location.reload();
    };
  }
});
