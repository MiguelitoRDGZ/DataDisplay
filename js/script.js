document.addEventListener('DOMContentLoaded', function() {
    // Chart data
    const complaintData = {
        labels: ['November', 'December', 'January', 'February', 'March'],
        datasets: [
            {
                label: 'Low Contribution',
                data: [18, 27, 21, 16, 11],
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                tension: 0.3
            },
            {
                label: 'Claim Delays',
                data: [9, 4, 10, 9, 9],
                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 2,
                tension: 0.3
            },
            {
                label: 'Unspecified',
                data: [8, 10, 2, 6, 22],
                backgroundColor: 'rgba(46, 204, 113, 0.7)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 2,
                tension: 0.3
            },
            {
                label: 'Technician Delays',
                data: [1, 6, 3, 6, 12],
                backgroundColor: 'rgba(155, 89, 182, 0.7)',
                borderColor: 'rgba(155, 89, 182, 1)',
                borderWidth: 2,
                tension: 0.3
            },
            {
                label: 'Coverage Denied',
                data: [0, 13, 10, 2, 8],
                backgroundColor: 'rgba(243, 156, 18, 0.7)',
                borderColor: 'rgba(243, 156, 18, 1)',
                borderWidth: 2,
                tension: 0.3
            }
        ]
    };

    const departmentData = {
        labels: ['Resolutions', 'Vendors', 'Dispatch', 'P&P', 'GCS', 'Authorizations'],
        datasets: [{
            label: 'Total Complaints',
            data: [72, 41, 38, 9, 9, 12],
            backgroundColor: [
                'rgba(52, 152, 219, 0.7)',
                'rgba(231, 76, 60, 0.7)',
                'rgba(46, 204, 113, 0.7)',
                'rgba(155, 89, 182, 0.7)',
                'rgba(243, 156, 18, 0.7)',
                'rgba(26, 188, 156, 0.7)'
            ],
            borderColor: '#fff',
            borderWidth: 1
        }]
    };

    // Create charts
    const trendsCtx = document.getElementById('trendsChart');
    const trendsChart = new Chart(trendsCtx, {
        type: 'line',
        data: complaintData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Complaint Trends',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Complaints'
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });

    const deptCtx = document.getElementById('departmentChart');
    const departmentChart = new Chart(deptCtx, {
        type: 'bar',
        data: departmentData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Complaints by Department',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Complaints'
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });

    // Populate monthly breakdown table
    const tableData = [
        { reason: 'Low Contribution', department: 'Resolutions', nov: 18, dec: 27, jan: 21, feb: 16, mar: 11, trend: 'Decreasing' },
        { reason: 'Claim Delays', department: 'Vendors, P&P, GCS', nov: 9, dec: 4, jan: 10, feb: 9, mar: 9, trend: 'Fluctuating' },
        { reason: 'Unspecified', department: 'N/A', nov: 8, dec: 10, jan: 2, feb: 6, mar: 22, trend: 'March Spike' },
        { reason: 'Technician Delays', department: 'Dispatch, Auth', nov: 1, dec: 6, jan: 3, feb: 6, mar: 12, trend: 'Increasing' },
        { reason: 'Coverage Denied', department: 'Resolutions, Dispatch', nov: 0, dec: 13, jan: 10, feb: 2, mar: 8, trend: 'December Spike' }
    ];
    
    // Calculate totals
    const totals = {
        nov: tableData.reduce((sum, row) => sum + row.nov, 0),
        dec: tableData.reduce((sum, row) => sum + row.dec, 0),
        jan: tableData.reduce((sum, row) => sum + row.jan, 0),
        feb: tableData.reduce((sum, row) => sum + row.feb, 0),
        mar: tableData.reduce((sum, row) => sum + row.mar, 0)
    };
    const tableBody = document.querySelector('.data-table tbody');
    
    // Add data rows
    tableData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.reason}</td>
            <td>${item.department}</td>
            <td>${item.nov}</td>
            <td>${item.dec}</td>
            <td>${item.jan}</td>
            <td>${item.feb}</td>
            <td>${item.mar}</td>
            <td><span class="trend-indicator">${item.trend}</span></td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add totals row
    const totalsRow = document.createElement('tr');
    totalsRow.className = 'totals-row';
    totalsRow.innerHTML = `
        <td><strong>Total</strong></td>
        <td>-</td>
        <td><strong>${totals.nov}</strong></td>
        <td><strong>${totals.dec}</strong></td>
        <td><strong>${totals.jan}</strong></td>
        <td><strong>${totals.feb}</strong></td>
        <td><strong>${totals.mar}</strong></td>
        <td>-</td>
    `;
    tableBody.appendChild(totalsRow);

    // Claims vs Complaints Analysis Table
    const claimsData = [
        { month: 'Nov-24', claims: 4424, complaints: 36 },
        { month: 'Dec-24', claims: 4513, complaints: 60 },
        { month: 'Jan-25', claims: 4936, complaints: 46 },
        { month: 'Feb-25', claims: 3895, complaints: 39 },
        { month: 'Mar-25', claims: 4274, complaints: 62 }
    ];

    // Calculate percentages and trends
    claimsData.forEach((monthData, index) => {
        monthData.percentage = ((monthData.complaints / monthData.claims) * 100).toFixed(2);
        
        if (index > 0) {
            const prevPercentage = parseFloat(claimsData[index-1].percentage);
            const currentPercentage = parseFloat(monthData.percentage);
            
            if (currentPercentage > prevPercentage) {
                monthData.trend = 'up';
            } else if (currentPercentage < prevPercentage) {
                monthData.trend = 'down';
            } else {
                monthData.trend = 'neutral';
            }
        } else {
            monthData.trend = 'neutral';
        }
    });

    // Populate comparison table
    const comparisonBody = document.querySelector('.comparison-table tbody');
    claimsData.forEach(monthData => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${monthData.month}</td>
            <td>${monthData.claims.toLocaleString()}</td>
            <td>${monthData.complaints}</td>
            <td class="percentage-cell">${monthData.percentage}%</td>
            <td>
                ${monthData.trend === 'up' ? 
                  '<i class="fas fa-arrow-up trend-up"></i>' : 
                  monthData.trend === 'down' ? 
                  '<i class="fas fa-arrow-down trend-down"></i>' : 
                  '<i class="fas fa-equals trend-neutral"></i>'}
            </td>
        `;
        comparisonBody.appendChild(row);
    });

    // Add animation classes
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
        section.classList.add('fade-in');
    });

    // Print optimization
    window.addEventListener('beforeprint', () => {
        trendsChart.resize(800, 400);
        departmentChart.resize(800, 400);
    });

    window.addEventListener('afterprint', () => {
        trendsChart.resize();
        departmentChart.resize();
    });
});