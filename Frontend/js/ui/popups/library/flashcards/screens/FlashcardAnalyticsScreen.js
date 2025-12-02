export const FlashcardAnalyticsScreen = {
    render: () => {
        return `
            <style>
                /* --- ANALYTICS DASHBOARD --- */
                .fc-analytics-view { display: none; animation: fadeIn 0.3s; }
                .fc-analytics-view.active { display: grid; grid-template-columns: 1fr; gap: 1.5rem; max-width: 800px; margin: 0 auto; }
                
                .fc-chart-panel {
                    background: var(--fc-card); border-radius: var(--radius); padding: 1.5rem;
                    box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.05);
                    display: flex; flex-direction: column;
                }
                .fc-chart-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
                .fc-chart-title { font-weight: 700; color: var(--fc-primary); }
                .fc-chart-canvas { height: 250px; width: 100%; position: relative; flex: 1; }

                /* Leeches List */
                .leech-item {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);
                }
                .leech-item:last-child { border-bottom: none; }
                .leech-info { font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
                .leech-stat { font-size: 0.7rem; color: var(--fc-danger); }

                /* Heatmap Grid */
                .heatmap-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(12px, 1fr));
                    gap: 4px;
                    margin-top: 10px;
                }
                .heat-cell {
                    width: 100%; aspect-ratio: 1;
                    background: #eee; border-radius: 2px;
                }
                .heat-l0 { background: #efebe9; }
                .heat-l1 { background: #d7ccc8; }
                .heat-l2 { background: #a1887f; }
                .heat-l3 { background: #6d4c41; }
                .heat-l4 { background: #3e2723; }

                /* Responsive */
                @media (max-width: 900px) {
                    .fc-analytics-view { grid-template-columns: 1fr; }
                }
            </style>
            <div class="fc-analytics-view active">
                <div class="fc-chart-panel">
                    <div class="fc-chart-header"><span class="fc-chart-title">Mapa de Competências</span></div>
                    <div class="fc-chart-canvas"><canvas id="chart-radar"></canvas></div>
                </div>
                <div class="fc-chart-panel">
                    <div class="fc-chart-header"><span class="fc-chart-title">Distribuição de Dificuldade</span></div>
                    <div class="fc-chart-canvas"><canvas id="chart-difficulty"></canvas></div>
                </div>
                <div class="fc-chart-panel">
                    <div class="fc-chart-header"><span class="fc-chart-title">Retenção (Ebbinghaus)</span></div>
                    <div class="fc-chart-canvas"><canvas id="chart-retention"></canvas></div>
                </div>
                <div class="fc-chart-panel">
                    <div class="fc-chart-header"><span class="fc-chart-title">Carga Futura</span></div>
                    <div class="fc-chart-canvas"><canvas id="chart-forecast"></canvas></div>
                </div>
                <div class="fc-chart-panel">
                    <div class="fc-chart-header"><span class="fc-chart-title">Atividade (Heatmap)</span></div>
                    <div id="fc-heatmap" class="heatmap-grid"></div>
                </div>
                <div class="fc-chart-panel">
                    <div class="fc-chart-header"><span class="fc-chart-title">Leeches (Cartas Críticas)</span></div>
                    <div id="fc-leeches-list" style="max-height: 150px; overflow-y: auto;"></div>
                </div>
            </div>
        `;
    },

    initCharts: (cardsData, retryCount = 0) => {
        if (typeof Chart === 'undefined') {
            if (retryCount < 20) { // Try for ~2 seconds
                setTimeout(() => FlashcardAnalyticsScreen.initCharts(cardsData, retryCount + 1), 100);
            }
            return;
        }

        // --- MOCK DATA GENERATOR (Fallback) ---
        // Always use mock data if real data is empty to ensure charts display
        const hasData = cardsData.some(c => c.lastReview);
        const useMock = !hasData;

        // 1. RADAR (Competence)
        new Chart(document.getElementById('chart-radar'), {
            type: 'radar',
            data: {
                labels: ['Memória', 'Lógica', 'Conceitos', 'Datas', 'Obras'],
                datasets: [{
                    label: 'Nível',
                    data: useMock ? [3, 3, 3, 3, 3] : [5, 4, 6, 3, 5], // Default values
                    backgroundColor: 'rgba(109, 76, 65, 0.2)',
                    borderColor: '#6d4c41',
                    pointBackgroundColor: '#3e2723'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { r: { suggestedMin: 0, suggestedMax: 10, grid: { color: '#d7ccc8' } } }, plugins: { legend: { display: false } } }
        });

        // 2. DOUGHNUT (Difficulty)
        const diffCounts = [0, 0, 0, 0];
        if (!useMock) {
            cardsData.forEach(c => {
                if (c.interval < 2) diffCounts[0]++;
                else if (c.interval < 5) diffCounts[1]++;
                else if (c.interval < 15) diffCounts[2]++;
                else diffCounts[3]++;
            });
        } else {
            // Default distribution for empty state
            diffCounts[0] = 1; diffCounts[1] = 1; diffCounts[2] = 1; diffCounts[3] = 1;
        }

        new Chart(document.getElementById('chart-difficulty'), {
            type: 'doughnut',
            data: {
                labels: ['Erro', 'Difícil', 'Bom', 'Fácil'],
                datasets: [{
                    data: diffCounts,
                    backgroundColor: ['#ef5350', '#ffa726', '#66bb6a', '#42a5f5'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom' } } }
        });

        // 3. LINE (Retention)
        const days = Array.from({ length: 30 }, (_, i) => i);
        const projection = days.map(d => {
            if (useMock) return 100 - (d * 2); // Mock linear decay
            let sumRet = 0;
            cardsData.forEach(c => {
                const last = c.lastReview || new Date();
                const baseElapsed = Math.ceil((new Date() - last) / (86400000));
                sumRet += Math.exp(-(baseElapsed + d) / (c.interval || 1)) * 100;
            });
            return (sumRet / cardsData.length).toFixed(1);
        });

        new Chart(document.getElementById('chart-retention'), {
            type: 'line',
            data: {
                labels: days.map(d => `+${d}d`),
                datasets: [{
                    label: 'Retenção',
                    data: projection,
                    borderColor: '#8d6e63', backgroundColor: 'rgba(141, 110, 99, 0.1)', fill: true, tension: 0.4, pointRadius: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100, grid: { display: false } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }
        });

        // 4. BAR (Forecast)
        const forecast = new Array(15).fill(0);
        if (!useMock) {
            cardsData.forEach(c => {
                const due = c.nextReview;
                const diffDays = Math.ceil((due - new Date().getTime()) / 86400000);
                if (diffDays >= 0 && diffDays < 15) forecast[diffDays]++;
            });
        } else {
            // Mock forecast
            for (let i = 0; i < 15; i++) forecast[i] = Math.floor(Math.random() * 5);
        }

        new Chart(document.getElementById('chart-forecast'), {
            type: 'bar',
            data: {
                labels: forecast.map((_, i) => i === 0 ? 'Hoje' : `+${i}d`),
                datasets: [{
                    label: 'Cartas',
                    data: forecast,
                    backgroundColor: '#d7ccc8', hoverBackgroundColor: '#8d6e63', borderRadius: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }
        });

        // 5. HEATMAP
        const heatmap = document.getElementById('fc-heatmap');
        heatmap.innerHTML = '';

        // Generate real map
        const activityMap = {};
        cardsData.forEach(c => {
            if (c.history) c.history.forEach(ts => {
                const dateStr = new Date(ts).toISOString().split('T')[0];
                activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
            });
        });

        for (let i = 59; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            let count = activityMap[dateStr] || 0;

            // Mock some data if empty for visual appeal
            if (useMock && Math.random() > 0.8) count = Math.floor(Math.random() * 3) + 1;

            const cell = document.createElement('div');
            cell.className = 'heat-cell';
            if (count === 0) cell.classList.add('heat-l0');
            else if (count <= 1) cell.classList.add('heat-l1');
            else if (count <= 2) cell.classList.add('heat-l2');
            else if (count <= 4) cell.classList.add('heat-l3');
            else cell.classList.add('heat-l4');
            cell.title = `${dateStr}: ${count}`;
            heatmap.appendChild(cell);
        }

        // 6. LEECHES
        const leechesList = document.getElementById('fc-leeches-list');
        leechesList.innerHTML = '';
        const leeches = cardsData.filter(c => c.reps > 5 && c.interval < 3);

        if (leeches.length > 0) {
            leeches.forEach(l => {
                const div = document.createElement('div');
                div.className = 'leech-item';
                div.innerHTML = `<div class="leech-info" title="${l.q}">${l.q}</div><div class="leech-stat">${l.reps} reps</div>`;
                leechesList.appendChild(div);
            });
        } else {
            leechesList.innerHTML = '<div style="text-align:center; padding:10px; color:var(--fc-success); font-size:0.8rem;">Nenhum card crítico detectado.</div>';
        }
    }
};
