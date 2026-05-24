// script_tasks.js
// Menambahkan fitur Transaksi Tugas (frontend demo/in-memory) tanpa mengubah dashboard analitik.

(function () {
  // Jika script ini dipanggil lebih dari sekali, hindari duplikasi state.
  if (window.__TASKS_FEATURE_LOADED__) return;
  window.__TASKS_FEATURE_LOADED__ = true;

  // prevent multiple bridge functions if script_tasks.js evaluated twice
  if (window.__TASKS_GLOBALS_BOUND__) return;
  window.__TASKS_GLOBALS_BOUND__ = true;

  const store = {
    tasks: [],
    submissions: [],
    notifications: [],
    // seed data demo
    seedDone: false,
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function seedIfNeeded() {
    if (store.seedDone) return;
    store.seedDone = true;

    // Seed kelas demo
    const demoTaskId = 1;
    store.tasks.push({
      id: demoTaskId,
      teacherUsername: 'guru',
      judul: 'Tugas Matematika: Limit Fungsi',
      deskripsi: 'Kerjakan soal limit fungsi. Tulis langkah-langkah.',
      kelas: 'X IPA 1',
      deadline: null,
      file_tugas_name: 'soal_limit.pdf',
      created_at: nowIso(),
    });

    store.submissions.push({
      id: 1,
      task_id: demoTaskId,
      student_nis: '2024-001',
      student_name: 'Budi',
      status: 'Dikerjakan',
      text_answer: 'Jawaban saya: ...',
      file_submission_name: null,
      submitted_at: nowIso(),
    });

    store.notifications.push({
      id: 1,
      teacherUsername: 'guru',
      task_id: demoTaskId,
      student_nis: '2024-001',
      student_name: 'Budi',
      type: 'SUBMISSION_UPLOADED',
      message: 'Budi (2024-001) sudah mengumpulkan jawaban untuk "Tugas Matematika"',
      is_read: 0,
      created_at: nowIso(),
    });
  }

  function getUserRole() {
    return localStorage.getItem('userRole');
  }

  function getUsername() {
    return localStorage.getItem('username');
  }

  // Demo student data (untuk mode murid yang tidak pakai database dulu)
  // Anda bisa ganti nanti saat DB sudah jadi.
  function getDemoStudentProfile() {
    const nis = localStorage.getItem('username') || '2024001';

    let nama = 'Murid';
    let kelas = 'X IPA 1';

    if (nis === '2024001') {
        nama = 'Budi';
        kelas = 'X IPA 1';
    } else if (nis === '2024002') {
        nama = 'Siti';
        kelas = 'X IPA 1';
    }

    return { nis, nama, kelas };
}

  function setVisible(id, show) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('d-none', !show);
  }

  // =========================
  // NAV + MENU INTEGRATION
  // =========================
  window.showTasks = function showTasks() {
    const dashboardMain = document.getElementById('dashboardMain');

    if (dashboardMain) {
        dashboardMain.style.display = 'none';
    }
    const role = getUserRole();
    // role saat ini hanya admin atau guru dari script_auth.js yang ada.
    // Untuk demo murid, kita tetap izinkan jika parameter demoRole=murid.
    const url = new URL(window.location.href);
    const demoRole = url.searchParams.get('demoRole');

    setCurrentBreadcrumb('Assignment');
    if (demoRole === 'murid' || role === 'murid') {
      currentTasksMode('murid');
    } else {
      currentTasksMode('guru');
    }
  };

  let currentMode = null;

  function currentTasksMode(mode) {
    currentMode = mode;
    const content = renderTasksContent(mode);
    document.getElementById('contentArea').innerHTML = content;
    seedIfNeeded();

    if (mode === 'guru') {
      bindGuruEvents();
      renderGuruTasks();
      renderGuruNotifications();
    } else {
      bindMuridEvents();
      renderMuridTasks();
      renderSubmissionBoxHint();
    }
  }

  function setCurrentBreadcrumb(text) {
    const el = document.getElementById('currentPage');
    if (el) el.textContent = text;
  }

  // =========================
  // RENDER: MAIN CONTENT
  // =========================
  function renderTasksContent(mode) {
    if (mode === 'guru') {
      return `
        <div class="row mb-4">
          <div class="col-12">
            <div class="card shadow">
              <div class="card-header py-3 bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <i class="fas fa-tasks me-2"></i>Assignment - Panel Murid
                  </div>
                  <button class="btn btn-light btn-sm" id="btnTasksRefresh">
                    <i class="fas fa-sync"></i> Refresh
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-lg-4">
                    <div class="border rounded-3 p-3 h-100 bg-light">
                      <div class="fw-bold mb-2"><i class="fas fa-upload me-2"></i>Upload Tugas</div>
                      <form id="formGuruUploadTugas">
                        <div class="mb-2">
                          <label class="form-label">Judul</label>
                          <input class="form-control" name="judul" required>
                          <div class="mb-2">
                            <label class="form-label">Mata Pelajaran</label>
                            <input class="form-control" name="mapel" required placeholder="Contoh: Matematika">
                          </div>
                        </div>
                        <div class="mb-2">
                          <label class="form-label">Kelas</label>
                          <input class="form-control" name="kelas" required placeholder="Contoh: X IPA 1">
                        </div>
                        <div class="mb-2">
                          <label class="form-label">Deskripsi</label>
                          <textarea class="form-control" name="deskripsi" rows="3"></textarea>
                        </div>
                        <div class="mb-2">
                          <label class="form-label">Deadline</label>
                          <input type="datetime-local" class="form-control" name="deadline">
                        </div>
                        <div class="mb-2">
                          <label class="form-label">File Tugas (demo: hanya nama)</label>
                          <input type="file" class="form-control" name="file_tugas" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg">
                        </div>
                        <button class="btn btn-warning w-100" type="submit">
                          <i class="fas fa-upload"></i> Upload
                        </button>
                      </form>
                    </div>
                  </div>

                  <div class="col-lg-8">
                    <div class="row g-3">
                      <div class="col-12">
                        <div class="border rounded-3 p-3 h-100">
                          <div class="d-flex justify-content-between align-items-center mb-2">
                            <div class="fw-bold"><i class="fas fa-bell me-2"></i>Notifikasi Submission</div>
                            <button class="btn btn-outline-primary btn-sm" id="btnGuruMarkAllRead">
                              <i class="fas fa-check-double"></i> Mark read
                            </button>
                          </div>
                          <div id="guruNotifBadge" class="mb-2 text-muted"></div>
                          <ul class="list-group" id="guruNotifList" style="max-height:240px;overflow:auto"></ul>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="border rounded-3 p-3 h-100">
                          <div class="fw-bold mb-2"><i class="fas fa-clipboard-list me-2"></i>Tugas Guru</div>
                          <div class="table-responsive">
                            <table class="table table-hover align-middle">
                              <thead>
                                <tr>
                                  <th>Judul</th>
                                  <th>Kelas</th>
                                  <th>Deadline</th>
                                  <th>Submission</th>
                                </tr>
                              </thead>
                              <tbody id="guruTasksTable"></tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Murid mode
    return `
      <div class="student-task-page">
        <div class="student-header mb-4">
          <div>
            <h3 class="fw-bold mb-1">Daftar Tugas</h3>
            <p class="text-muted mb-0">Lihat tugas berdasarkan kelas dan kumpulkan jawaban sebelum deadline.</p>
          </div>
          <div class="student-id-card">
            <div class="small text-muted">NIS</div>
            <div class="fw-bold" id="muridNis"></div>
            <div class="small" id="muridKelas"></div>
          </div>
        </div>

        <div id="muridTasksCardList" class="student-task-list"></div>

        <div class="alert alert-primary mt-4">
          <i class="fas fa-info-circle me-2"></i>
          Pastikan jawaban sudah benar sebelum dikumpulkan.
        </div>
      </div>
    `;
  }

  // =========================
  // GURU: Events + Render
  // =========================
  function bindGuruEvents() {
    document.getElementById('btnTasksRefresh')?.addEventListener('click', () => {
      renderGuruTasks();
      renderGuruNotifications();
    });

    document.getElementById('btnGuruMarkAllRead')?.addEventListener('click', () => {
  const teacherUsername = getUsername();

  fetch('backend/mark_notifikasi_read.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `created_by=${encodeURIComponent(teacherUsername)}`
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      renderGuruNotifications();
    } else {
      alert('Gagal menandai notifikasi.');
      console.log(data.error);
    }
  });
});

    document.getElementById('formGuruUploadTugas')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const teacherUsername = getUsername();
      const fd = new FormData(e.target);

      const judul = String(fd.get('judul') || '').trim();
      const kelas = String(fd.get('kelas') || '').trim();
      const deskripsi = String(fd.get('deskripsi') || '').trim();
      const mapel = String(fd.get('mapel') || '').trim();
      const deadline = fd.get('deadline') ? String(fd.get('deadline')) : '';
      const file = e.target.querySelector('input[name="file_tugas"]')?.files?.[0];
      const fileName = file ? file.name : null;

      const newId = (store.tasks.reduce((m, t) => Math.max(m, t.id), 0) || 0) + 1;

      fetch('backend/tambah_tugas.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          `judul=${encodeURIComponent(judul)}` +
          `&mapel=${encodeURIComponent(mapel)}` +
          `&deskripsi=${encodeURIComponent(deskripsi)}` +
          `&kelas=${encodeURIComponent(kelas)}` +
          `&deadline=${encodeURIComponent(deadline)}` +
          `&created_by=${encodeURIComponent(teacherUsername)}`
    })
    .then(res => res.json())
    .then(data => {
    if (data.success) {
        alert('Tugas berhasil disimpan ke database');
        e.target.reset();
        renderGuruTasks();
    } else {
        alert('Gagal menyimpan tugas: ' + (data.error || 'Tidak diketahui'));
    }
      })
      .catch(error => {
          console.log('Error upload tugas:', error);
          alert('Upload gagal. Cek Console atau file tambah_tugas.php');
      });
    });
    
  }

  function renderGuruTasks() {
    
    const tbody = document.getElementById('guruTasksTable');

    if (!tbody) return;

    fetch('backend/get_tugas.php')
    .then(res => res.json())
    .then(tasks => {

        tbody.innerHTML = '';

        tasks.forEach(t => {

            const tr = document.createElement('tr');

            tr.innerHTML = `
            <td class="fw-semibold">${t.judul}</td>
            <td>${t.kelas}</td>
            <td>${t.deadline ? t.deadline : '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editTugas('${t.id}', '${t.judul}', '${t.deskripsi}', '${t.kelas}', '${t.deadline}')">
                    Edit
                </button>

                <button class="btn btn-sm btn-danger" onclick="hapusTugas('${t.id}')">
                    Hapus
                </button>
            </td>
        `;

            tbody.appendChild(tr);

        });

        if (tasks.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-muted">
                        Belum ada tugas.
                    </td>
                </tr>
            `;
        }

    });

}

  window.hapusTugas = function(id) {

    if (!confirm('Yakin mau hapus tugas ini?')) return;

    fetch('backend/hapus_tugas.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `id=${encodeURIComponent(id)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Tugas berhasil dihapus');
            renderGuruTasks();
        } else {
            alert('Gagal menghapus tugas');
        }
    });
};

  window.editTugas = function(id, judul, deskripsi, kelas, deadline) {

    const judulBaru = prompt('Edit judul tugas:', judul);
    if (judulBaru === null) return;

    const deskripsiBaru = prompt('Edit deskripsi:', deskripsi);
    if (deskripsiBaru === null) return;

    const kelasBaru = prompt('Edit kelas:', kelas);
    if (kelasBaru === null) return;

    const deadlineBaru = prompt('Edit deadline:', deadline || '');
    if (deadlineBaru === null) return;

    fetch('backend/edit_tugas.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          `judul=${encodeURIComponent(judul)}` +
          `&mapel=${encodeURIComponent(mapel)}` +
          `&deskripsi=${encodeURIComponent(deskripsi)}` +
          `&kelas=${encodeURIComponent(kelas)}` +
          `&nama_guru=${encodeURIComponent(nama_guru)}` +
          `&deadline=${encodeURIComponent(deadline)}` +
          `&created_by=${encodeURIComponent(teacherUsername)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Tugas berhasil diedit');
            renderGuruTasks();
        } else {
            alert('Gagal mengedit tugas');
        }
    });
};

  function renderGuruNotifications() {
    const teacherUsername = getUsername();
    const list = document.getElementById('guruNotifList');
    const badge = document.getElementById('guruNotifBadge');

    if (!list) return;

    fetch(`backend/get_notifikasi_guru.php?created_by=${encodeURIComponent(teacherUsername)}`)
    .then(res => res.json())
    .then(notifs => {
        list.innerHTML = '';

        const unread = notifs.filter(n => String(n.is_read_guru) === '0').length;

        if (badge) {
            badge.textContent = unread > 0
                ? `Anda punya ${unread} submission baru.`
                : 'Tidak ada notifikasi baru.';
        }

        if (notifs.length === 0) {
            list.innerHTML = `
                <li class="list-group-item text-muted">
                    Belum ada notifikasi.
                </li>
            `;
            return;
        }

        notifs.forEach(n => {
            const isUnread = String(n.is_read_guru) === '0';

            const li = document.createElement('li');
            li.className = `list-group-item ${isUnread ? 'bg-light border-start border-4 border-primary' : ''}`;

            li.innerHTML = `
                <div class="fw-semibold">
                    ${n.nama_siswa || n.siswa_nis} sudah mengumpulkan tugas
                </div>
                <div class="small text-muted">
                    ${n.mapel || 'Mapel'} - ${n.judul} | Kelas ${n.kelas}
                </div>
                <div class="small text-muted">
                    Waktu submit: ${n.submitted_at}
                </div>
            `;

            list.appendChild(li);
        });
    })
    .catch(error => {
        console.log('Gagal ambil notifikasi guru:', error);
        list.innerHTML = `
            <li class="list-group-item text-danger">
                Gagal mengambil notifikasi.
            </li>
        `;
    });
}

  // =========================
  // MURID: Events + Render
  // =========================
  function bindMuridEvents() {
    const p = getDemoStudentProfile();

    const nisEl = document.getElementById('muridNis');
    const kelasEl = document.getElementById('muridKelas');

    if (nisEl) nisEl.textContent = p.nis;
    if (kelasEl) kelasEl.textContent = p.kelas;
}

  function renderSubmissionBoxHint() {
    const hint = document.getElementById('submissionHint');
    if (!hint) return;
    const taskId = Number(document.getElementById('submission_task_id')?.value || 0);
    if (!taskId) {
      hint.textContent = 'Pilih tugas terlebih dahulu dari tabel di atas.';
      return;
    }
    hint.textContent = `Anda sedang mengerjakan task_id=${taskId}.`;
  }

  function muridPickTask(taskId) {
    const input = document.getElementById('submission_task_id');
    const btn = document.getElementById('btnSubmitJawaban');
    if (!input || !btn) return;
    input.value = String(taskId);
    btn.disabled = false;
    renderSubmissionBoxHint();
  }

  function renderMuridTasks() {
    const student = getDemoStudentProfile();
    const list = document.getElementById('muridTasksCardList');

    if (!list) return;

    document.getElementById('muridNis').textContent = student.nis;
    document.getElementById('muridKelas').textContent = student.kelas;

    fetch(`backend/get_tugas_murid.php?nis=${encodeURIComponent(student.nis)}`)
    .then(res => res.json())
    .then(tasks => {
        list.innerHTML = '';

        if (tasks.length === 0) {
            list.innerHTML = `
                <div class="card p-4 text-muted">
                    Belum ada tugas untuk kelas ${student.kelas}.
                </div>
            `;
            return;
        }

        tasks.forEach(t => {
            const sudahSubmit = t.submission_id !== null;

            const card = document.createElement('div');
            card.className = 'student-task-card';

            card.innerHTML = `
                <div class="task-icon">
                    <i class="fas fa-book"></i>
                </div>

                <div class="task-info">
                    <h5>${t.mapel || 'Mata Pelajaran'}</h5>
                    <p class="task-title">Tugas: ${t.judul}</p>
                    <p class="task-teacher">Guru: ${t.nama_guru || t.created_by}</p>
                    <p class="task-publish">Publish: ${t.created_at || '-'}</p>
                </div>

                <div class="task-deadline">
                    <span>Deadline</span>
                    <strong>${t.deadline || '-'}</strong>
                    <small class="badge ${sudahSubmit ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} mt-2">
                        ${sudahSubmit ? 'Sudah Dikumpulkan' : 'Belum Dikumpulkan'}
                    </small>
                </div>

                <button class="btn ${sudahSubmit ? 'btn-outline-primary' : 'btn-primary'}" onclick="submitTugasMurid('${t.id}')">
                    ${sudahSubmit ? 'Edit Jawaban' : 'Kerjakan / Submit'}
                </button>
            `;

            list.appendChild(card);
        });
    })
    .catch(err => {
        console.log(err);
        list.innerHTML = `
            <div class="card p-4 text-danger">
                Gagal mengambil data tugas.
            </div>
        `;
    });
}

  window.submitTugasMurid = function(tugasId) {
    const student = getDemoStudentProfile();

    const jawaban = prompt('Tulis jawaban tugas:');
    if (jawaban === null || jawaban.trim() === '') return;

    fetch('backend/submit_tugas.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
            `tugas_id=${encodeURIComponent(tugasId)}` +
            `&siswa_nis=${encodeURIComponent(student.nis)}` +
            `&jawaban=${encodeURIComponent(jawaban)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Tugas berhasil dikumpulkan');
        } else {
            alert('Gagal submit tugas');
            console.log(data.error);
        }
    });
};

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '<')
      .replaceAll('>', '>')
      .replaceAll('"', '"')
      .replaceAll("'", '&#039;');
  }
})();

