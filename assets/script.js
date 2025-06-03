// Storage Keys
const LOGGED_CASES_KEY = 'agenda_logged_cases';
const APPROACHES_KEY = 'agenda_approaches_pending';
const ASSIGNED_KEY = 'agenda_cases_assigned';

// --- Utility Functions ---
function generateID() {
  return 'CASE-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 10000);
}

function saveToStorage(key, newEntry) {
  const existing = JSON.parse(localStorage.getItem(key)) || [];
  existing.push(newEntry);
  localStorage.setItem(key, JSON.stringify(existing));
}

function updateStorage(key, dataArray) {
  localStorage.setItem(key, JSON.stringify(dataArray));
}

function removeFromStorage(key, id) {
  const data = JSON.parse(localStorage.getItem(key)) || [];
  const updated = data.filter(entry => entry.id !== id);
  updateStorage(key, updated);
}

// --- For Add Case Page ---
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
        assignedTo: null,
      };

      saveToStorage(LOGGED_CASES_KEY, newCase);
      saveToStorage(APPROACHES_KEY, newCase);

      alert('Case added successfully!');
      form.reset();
    });
  }

  // --- For Approaches Page ---
  const cardsContainer = document.getElementById('approachCards');
  const modal = document.getElementById('approachModal');
  const closeBtn = document.getElementById('closeApproachModal');
  const approachForm = document.getElementById('approachForm');

  if (cardsContainer) {
    const data = JSON.parse(localStorage.getItem(APPROACHES_KEY)) || [];

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

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (document.getElementById('policyType')) {
    // --- Dynamic Form Logic ---
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

    window.openApproachForm = function (id) {
      selectedCaseId = id;
      modal.classList.remove('hidden');
    };

    policyType.addEventListener('change', () => {
      lengthContainer.classList.toggle('hidden', policyType.value !== 'Yearly');
    });

    premiumOption.addEventListener('change', () => {
      customPremium.classList.toggle('hidden', premiumOption.value !== 'custom');
    });

    addClaimBtn.addEventListener('click', () => {
      const div = document.createElement('div');
      div.className = 'claim-row';
      div.innerHTML = `
        <input type="text" placeholder="Description" class="claim-desc">
        <input type="number" placeholder="Amount" class="claim-amount">
      `;
      claimList.appendChild(div);
    });

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

    agreementPrice.addEventListener('input', calculateTotals);
    customPremium.addEventListener('input', calculateTotals);
    pcfsPaid.addEventListener('input', calculateTotals);
    claimList.addEventListener('input', calculateTotals);

    approachForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const approachData = {
        policyType: policyType.value,
        policyLength: policyType.value === 'Yearly' ? policyLength.value : null,
        agreementPrice: parseFloat(agreementPrice.value),
        startDate: document.getElementById('startDate').value,
        premiumsPaid: premiumOption.value === 'same'
          ? parseFloat(agreementPrice.value)
          : parseFloat(customPremium.value || 0),
        pcfsPaid: parseFloat(pcfsPaid.value),
        totalPaid: parseFloat(totalPaid.value.replace('$', '')),
        claimExpenses: Array.from(document.querySelectorAll('.claim-row')).map(row => ({
          desc: row.querySelector('.claim-desc').value,
          amount: parseFloat(row.querySelector('.claim-amount').value || 0)
        })),
        weHaveInHouse: parseFloat(weHaveInHouse.value.replace('$', '')),
        ourApproach: document.getElementById('ourApproach').value
      };

      // Update the case and move it to Assigned
      const data = JSON.parse(localStorage.getItem(APPROACHES_KEY)) || [];
      const caseIndex = data.findIndex(c => c.id === selectedCaseId);
      if (caseIndex !== -1) {
        const caseItem = data[caseIndex];
        caseItem.approach = approachData;

        const agent = prompt("Assign to (type full name):");
        caseItem.assignedTo = agent;
        caseItem.status = 'Pending';

        // Save to Assigned, remove from Approaches
        saveToStorage(ASSIGNED_KEY, caseItem);
        removeFromStorage(APPROACHES_KEY, selectedCaseId);

        alert("Approach saved and case assigned.");
        location.reload();
      }
    });
  }
});
