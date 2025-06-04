document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const caseForm = document.getElementById('caseForm');
    const approachForm = document.getElementById('approachForm');
    const casesContainer = document.getElementById('casesContainer');
    const approachModal = document.getElementById('approachModal');
    const closeModal = document.querySelector('.close');
    const currentCaseIdInput = document.getElementById('currentCaseId');

    // State
    let cases = JSON.parse(localStorage.getItem('cases')) || [];
    let currentCaseId = null;

    // Initialize the app
    renderCases();

    // Event Listeners
    caseForm.addEventListener('submit', handleCaseSubmit);
    approachForm.addEventListener('submit', handleApproachSubmit);
    closeModal.addEventListener('click', () => approachModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === approachModal) {
            approachModal.style.display = 'none';
        }
    });

    // Functions
    function handleCaseSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('caseTitle').value;
        const description = document.getElementById('caseDescription').value;
        const priority = document.getElementById('casePriority').value;
        
        const newCase = {
            id: Date.now().toString(),
            title,
            description,
            priority,
            approaches: []
        };
        
        cases.push(newCase);
        saveCases();
        renderCases();
        caseForm.reset();
    }

    function handleApproachSubmit(e) {
        e.preventDefault();
        
        const method = document.getElementById('approachMethod').value;
        const details = document.getElementById('approachDetails').value;
        const date = document.getElementById('approachDate').value;
        
        const newApproach = {
            method,
            details,
            date
        };
        
        const caseIndex = cases.findIndex(c => c.id === currentCaseId);
        if (caseIndex !== -1) {
            cases[caseIndex].approaches.push(newApproach);
            saveCases();
            renderCases();
            approachForm.reset();
            approachModal.style.display = 'none';
        }
    }

    function renderCases() {
        casesContainer.innerHTML = '';
        
        if (cases.length === 0) {
            casesContainer.innerHTML = '<p class="no-cases">No cases added yet.</p>';
            return;
        }
        
        cases.forEach(c => {
            const caseCard = document.createElement('div');
            caseCard.className = `case-card ${c.priority}-priority`;
            
            const priorityClass = `priority-${c.priority}`;
            
            caseCard.innerHTML = `
                <h3 class="case-title">${c.title}</h3>
                <p class="case-description">${c.description}</p>
                <span class="case-priority ${priorityClass}">${c.priority.toUpperCase()}</span>
                <div>
                    <button class="approach-btn" data-case-id="${c.id}">Add Approach</button>
                    <button class="delete-btn" data-case-id="${c.id}">Delete Case</button>
                </div>
                ${c.approaches.length > 0 ? `
                    <div class="approaches-list">
                        <h4>Approaches (${c.approaches.length})</h4>
                        ${c.approaches.map(a => `
                            <div class="approach-item">
                                <div class="approach-method">${a.method}</div>
                                <p class="approach-details">${a.details}</p>
                                <div class="approach-date">${formatDate(a.date)}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            `;
            
            casesContainer.appendChild(caseCard);
        });
        
        // Add event listeners to approach buttons
        document.querySelectorAll('.approach-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentCaseId = e.target.getAttribute('data-case-id');
                currentCaseIdInput.value = currentCaseId;
                approachModal.style.display = 'block';
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const caseId = e.target.getAttribute('data-case-id');
                cases = cases.filter(c => c.id !== caseId);
                saveCases();
                renderCases();
            });
        });
    }

    function saveCases() {
        localStorage.setItem('cases', JSON.stringify(cases));
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
});