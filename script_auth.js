document.addEventListener('DOMContentLoaded', function () {

    const modalEl = document.getElementById('loginModal');
    const loginModal = new bootstrap.Modal(modalEl);

    const mainApp = document.getElementById('mainApp');
    const userInfo = document.getElementById('userInfo');
    const adminBtn = document.getElementById('adminBtn');

    // =========================
    // CEK LOGIN SAAT REFRESH
    // =========================
    if (localStorage.getItem('isLoggedIn') === 'true') {

        mainApp.classList.remove('d-none');

        // bersihin backdrop kalau ada
        document.body.classList.remove('modal-open');
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

        const role = localStorage.getItem('userRole');
        const username = localStorage.getItem('username');

        userInfo.textContent = `${role === 'guru' ? 'Guru' : 'Murid'}: ${username}`;

        if (adminBtn) {
            adminBtn.style.display = 'none';
        }

        showDashboard();

    } else {
        // kalau belum login → tampilkan modal
        loginModal.show();
    }

    // =========================
    // LOGIN HANDLER
    // =========================
    document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('backend/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {

        console.log(data);

        if (data.success) {

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('username', data.username);

            loginSuccess(
                data.role === 'guru' ? 'Guru' : 'Murid',
                data.username,
                false
            );

        } else {

            alert('Username atau password salah!');

        }

    })
    .catch(error => {
        console.log(error);
        alert('Koneksi ke backend gagal!');
    });

});

    // =========================
    // LOGOUT
    // =========================
    document.getElementById('logoutBtn').addEventListener('click', function () {
        localStorage.clear();
        location.reload();
    });

    // =========================
    // FUNCTION SUCCESS LOGIN
    // =========================
    function loginSuccess(roleText, username, isAdmin) {

        loginModal.hide();

        // tunggu animasi bootstrap selesai
        setTimeout(() => {
            document.body.classList.remove('modal-open');
            document.body.style = '';
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        }, 300);

        mainApp.classList.remove('d-none');
        userInfo.textContent = `${roleText}: ${username}`;

        if (adminBtn) {
            adminBtn.style.display = isAdmin ? 'block' : 'none';
        }

        showDashboard();
    }

});