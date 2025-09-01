document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tableBody = document.querySelector('.table-body');

    const investmentData = [
        { id: 1, date: '2023-10-26 10:00', principal: 1000, profit: 12, progress: '进行中' },
        { id: 2, date: '2023-10-25 15:30', principal: 500, profit: 6, progress: '已完成' },
    ];

    const redemptionData = [
        { id: 1, date: '2023-10-24 12:00', principal: 800, profit: 9.6, progress: '已赎回' },
    ];

    function renderTable(data) {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<div class="no-data">暂无数据</div>';
            return;
        }
        data.forEach(item => {
            const row = document.createElement('div');
            row.classList.add('table-row');
            row.innerHTML = `
                <div class="col col-1">${item.id}</div>
                <div class="col col-2">${item.date}</div>
                <div class="col col-3">${item.principal}</div>
                <div class="col col-4">${item.profit}</div>
                <div class="col col-5">${item.progress}</div>
            `;
            tableBody.appendChild(row);
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.textContent.includes('投资列表')) {
                renderTable(investmentData);
            } else {
                renderTable(redemptionData);
            }
        });
    });

    // Initial render
    renderTable(investmentData);
});
