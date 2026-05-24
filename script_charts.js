// ============================
// GLOBAL CONFIG CHART
// ============================

Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.plugins.legend.position = 'top';
Chart.defaults.responsive = true;

// ============================
// UTIL FUNCTION
// ============================

function randomData(min, max, count) {
    return Array.from({ length: count }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

// ============================
// ADVANCED PERFORMANCE CHART
// ============================

function initPerformanceChart(){
    // destroy existing chart instance if any
    if (window.__CHART_INSTANCES__?.performanceChart) {
        try { window.__CHART_INSTANCES__.performanceChart.destroy(); } catch(e) {}
        window.__CHART_INSTANCES__.performanceChart = null;
    }

    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            datasets: [
                {
                    label: 'Nilai Rata-rata',
                    data: randomData(70, 90, 6),
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Target Sekolah',
                    data: [80, 80, 80, 80, 80, 80],
                    borderDash: [5, 5]
                }
            ]
        }
    });
}

// ============================
// QUICK STATS (SIMULASI ANALITIK)
// ============================

function initQuickStats() {
    const el = document.getElementById('statsQuick');
    if (!el) return;

    const avg = Math.floor(Math.random() * 20) + 75;
    const attendance = Math.floor(Math.random() * 10) + 90;

    el.innerHTML = `
        <p>Rata-rata Nilai: <strong>${avg}</strong></p>
        <p>Kehadiran: <strong>${attendance}%</strong></p>
        <p>Status: <strong>${avg > 80 ? 'Baik' : 'Cukup'}</strong></p>
    `;
}

// ============================
// ACADEMIC CHARTS
// ============================

function initAcademicCharts() {
    const gradeCtx = document.getElementById('gradeChart');
    const attendanceCtx = document.getElementById('attendanceChart');

    if (gradeCtx) {
        new Chart(gradeCtx, {
            type: 'bar',
            data: {
                labels: ['Matematika', 'B. Indo', 'IPA', 'IPS'],
                datasets: [{
                    label: 'Nilai',
                    data: randomData(60, 95, 4)
                }]
            }
        });
    }

    if (attendanceCtx) {
        new Chart(attendanceCtx, {
            type: 'pie',
            data: {
                labels: ['Hadir', 'Izin', 'Alpha'],
                datasets: [{
                    data: [85, 10, 5]
                }]
            }
        });
    }
}

// ============================
// REPORT CHART
// ============================

function initReportChart() {
    const ctx = document.getElementById('reportChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Semester 1', 'Semester 2'],
            datasets: [{
                label: 'Trend Nilai',
                data: randomData(70, 90, 2),
                fill: true,
                tension: 0.3
            }]
        }
    });
}

// ============================
// SIMPLE ANALYTICS ENGINE 😅
// ============================

function calculateAverage(data) {
    const sum = data.reduce((a, b) => a + b, 0);
    return Math.round(sum / data.length);
}

function detectSimpleAnomaly(data) {
    const avg = calculateAverage(data);

    return data.map(val => {
        return (val < avg - 15) ? 'Anomali' : 'Normal';
    });
}

// ============================
// EXPORT HELPER (SIMULASI)
// ============================

function exportChartToImage(chartId) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = chartId + '.png';
    link.href = canvas.toDataURL();
    link.click();
}

// ============================
// AUTO INIT SAFETY
// ============================

document.addEventListener('DOMContentLoaded', () => {
    console.log("Charts module loaded. Pretending to be smart.");
});