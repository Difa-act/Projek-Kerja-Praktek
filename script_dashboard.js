let currentModule = 'dashboard';

function showDashboard() {
    currentModule = 'dashboard';

    document.getElementById('currentPage').textContent = 'Dashboard Utama';

    // tampilkan statistik utama
    const dashboardMain = document.getElementById('dashboardMain');

    if (dashboardMain) {
        dashboardMain.style.display = 'flex';
    }

    loadDashboardContent();
}

function showAcademic() {
    currentModule = 'academic';
    document.getElementById('currentPage').textContent = 'Data Akademik';
    const dashboardMain = document.getElementById('dashboardMain');

    if (dashboardMain) {
    dashboardMain.style.display = 'none';
    }
    loadAcademicContent();
}

function showManagement() {
    if (localStorage.getItem('userRole') !== 'admin') {
        alert('Akses ditolak! Hanya admin yang dapat mengakses manajemen data.');
        return;
    }
    currentModule = 'management';
    document.getElementById('currentPage').textContent = 'Manajemen Data';
    const dashboardMain = document.getElementById('dashboardMain');

    if (dashboardMain) {
        dashboardMain.style.display = 'none';
    }
    loadManagementContent();
}

function showReports() {
    currentModule = 'reports';
    document.getElementById('currentPage').textContent = 'Laporan & Analitik';
    const dashboardMain = document.getElementById('dashboardMain');

    if (dashboardMain) {
        dashboardMain.style.display = 'none';
    }
    loadReportsContent();
}

// ===== Transaksi Tugas (tambahan menu) =====
// Catatan: showTasks didefinisikan di script_tasks.js.
// Di file ini sengaja tidak didefinisikan agar tidak terjadi recursion / bentrok function name.



function loadDashboardContent() {
    const content = `
        <div class="row">
            <div class="col-xl-8 col-lg-7">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 fw-bold text-primary">Dashboard Akademik Sekolah</h6>
                    </div>
                    <div class="card-body">
                        <canvas id="performanceChart"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-xl-4 col-lg-5">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Statistik Utama</h6>
                    </div>
                    <div class="card-body">
                        <div id="statsQuick"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('contentArea').innerHTML = content;
    initPerformanceChart();
    initQuickStats();
}

function loadAcademicContent() {
    const content = `
        <div class="row">
            <div class="col-12">
                <div class="filter-section">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <label class="form-label text-white mb-2">Filter Kelas:</label>
                            <select class="form-select" id="classFilter">
                                <option>X IPA 1</option>
                                <option>X IPS 1</option>
                                <option>XI IPA 1</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-white mb-2">Periode:</label>
                            <select class="form-select" id="periodFilter">
                                <option>2023/2024 Genap</option>
                                <option>2023/2024 Ganjil</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-white mb-2">Jenis Data:</label>
                            <select class="form-select" id="dataType">
                                <option>Nilai</option>
                                <option>Kehadiran</option>
                                <option>Rekap Rapor</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-light w-100 mt-4" onclick="applyFilters()">
                                <i class="fas fa-filter"></i> Terapkan Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <div class="card shadow">
                    <div class="card-header py-3 d-flex justify-content-between">
                        <h6 class="m-0 font-weight-bold text-primary">Rata-rata Nilai</h6>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary" onclick="exportData('chart1')">PDF</button>
                            <button class="btn btn-sm btn-outline-success" onclick="exportData('excel1')">Excel</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <canvas id="gradeChart"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card shadow">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Tingkat Kehadiran</h6>
                    </div>
                    <div class="card-body">
                        <canvas id="attendanceChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12">
                <div class="card shadow">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Tabel Data Siswa</h6>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover" id="studentTable">
                                <thead>
                                    <tr>
                                        <th>NIS</th>
                                        <th>Nama</th>
                                        <th>Kelas</th>
                                        <th>Rata-rata Nilai</th>
                                        <th>Kehadiran</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('contentArea').innerHTML = content;
    initAcademicCharts();
    initStudentTable();
}

function loadManagementContent() {
    const content = `
        <div class="card shadow">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-warning">Manajemen Data (Admin)</h6>
            </div>
            <div class="card-body">
                <form id="dataForm">
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <input type="text" class="form-control" placeholder="Nama Siswa">
                        </div>
                        <div class="col-md-4 mb-3">
                            <input type="text" class="form-control" placeholder="Kelas">
                        </div>
                        <div class="col-md-4 mb-3">
                            <input type="number" class="form-control" placeholder="Nilai">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-warning">Simpan Data</button>
                </form>
            </div>
        </div>
    `;
    document.getElementById('contentArea').innerHTML = content;
}

function loadReportsContent() {
    const content = `
        <div class="row">
            <div class="col-12">
                <div class="filter-section">
                    <div class="row">
                        <div class="col-md-4">
                            <select class="form-select" id="reportType">
                                <option>Akademik</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <input type="month" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-light w-100" onclick="generateReport()">
                                Generate Laporan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8">
                <div class="card shadow">
                    <div class="card-body">
                        <canvas id="reportChart"></canvas>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card shadow anomaly-alert">
                    <div class="card-body">
                        <h6 class="text-danger">Deteksi Anomali</h6>
                        <ul id="anomalyList"></ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('contentArea').innerHTML = content;
}

/* ============================
   FILTER & EXPORT
============================ */

function applyFilters() {
    alert('Filter diterapkan (dummy)');
}

function exportData(type) {
    alert(`Export ${type} berhasil (simulasi)`);
}

function generateReport() {
    initReportChart();
    detectAnomaly();
}

/* ============================
   CHARTS INIT
============================ */

// init* chart & stats untuk analitik sekarang dipakai dari script_charts.js
// (fungsi duplicate di file ini sengaja dihilangkan untuk mencegah chart dibuat lebih dari sekali).

function initStudentTable() {
    const tbody = document.querySelector('#studentTable tbody');
    const data = [
        { nis: '001', nama: 'Budi', kelas: 'X IPA 1', nilai: 85, hadir: '95%', status: 'Aman' },
        { nis: '002', nama: 'Siti', kelas: 'X IPA 1', nilai: 60, hadir: '70%', status: 'Perlu Perhatian' }
    ];

    data.forEach(d => {
        tbody.innerHTML += `
            <tr>
                <td>${d.nis}</td>
                <td>${d.nama}</td>
                <td>${d.kelas}</td>
                <td>${d.nilai}</td>
                <td>${d.hadir}</td>
                <td>${d.status}</td>
            </tr>
        `;
    });
}

function initReportChart() {
    new Chart(document.getElementById('reportChart'), {
        type: 'line',
        data: {
            labels: ['Semester 1', 'Semester 2'],
            datasets: [{
                label: 'Trend',
                data: [78, 84]
            }]
        }
    });
}

/* ============================
   SIMPLE ANOMALY DETECTION
============================ */

function detectAnomaly() {
    const list = document.getElementById('anomalyList');
    list.innerHTML = '';

    const data = [
        { nama: 'Siti', nilai: 60, hadir: 70 },
        { nama: 'Andi', nilai: 85, hadir: 95 }
    ];

    data.forEach(d => {
        if (d.nilai < 70 || d.hadir < 75) {
            list.innerHTML += `<li>${d.nama} terdeteksi anomali</li>`;
        }
    });

    if (list.innerHTML === '') {
        list.innerHTML = '<li>Tidak ada anomali</li>';
    }
}

document.addEventListener('submit', function(e) {
    if (e.target && e.target.id === 'dataForm') {
        e.preventDefault();

        alert('Data berhasil disimpan (simulasi)');

        // optional reset form
        e.target.reset();
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // kalau sudah login langsung tampil dashboard
    if (localStorage.getItem('isLoggedIn') === 'true') {

        setTimeout(() => {

            if (typeof showDashboard === 'function') {
                showDashboard();
            }

        }, 100);

    }

});