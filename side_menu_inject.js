// side_menu_inject.js
// Menyisipkan sidebar kiri (hamburger) tanpa mengubah logika utama.

(function () {
  if (window.__SIDE_MENU_INJECTED__) return;
  window.__SIDE_MENU_INJECTED__ = true;

  const MENU_HTML = `
    <button class="btn btn-primary" id="sidebarToggle" type="button" aria-label="Toggle menu">
      <i class="fas fa-bars"></i>
    </button>

    <div id="sidebar" class="position-fixed top-0 start-0 h-100">
      <div class="brand">SMAN 1 Kota Tangerang Selatan</div>
      <nav class="nav nav-pills flex-column px-2 pt-2" id="sidebarNav">
        <a class="nav-link" href="#" data-module="dashboard" onclick="event.preventDefault();showDashboard();"> 
          <i class="fas fa-home me-2"></i><span>Dashboard</span>
        </a>
        <a class="nav-link" href="#" data-module="academic" onclick="event.preventDefault();showAcademic();">
          <i class="fas fa-graduation-cap me-2"></i><span>Akademik</span>
          </a>
          <a class="nav-link" href="#" data-module="tasks" onclick="event.preventDefault();showTasks();">
            <i class="fas fa-exchange-alt me-2"></i><span>Assignment</span>
          </a>
        <a class="nav-link d-none" href="#" id="sidebarAdminLink" data-module="management" onclick="event.preventDefault();showManagement();">
          <i class="fas fa-cog me-2"></i><span>Manajemen</span>
        </a>
        <a class="nav-link" href="#" data-module="reports" onclick="event.preventDefault();showReports();">
          <i class="fas fa-chart-bar me-2"></i><span>Laporan</span>
        </a>
      </nav>

      <div class="p-2" id="sidebarSpacer"></div>
    </div>

    <div id="contentWrap">
      <!-- content original will remain; inject just toggles sidebar -->
    </div>
  `;

  function setupLayoutWrap() {
    // Bungkus seluruh mainApp ke #appShell untuk sidebar layout
    const mainApp = document.getElementById('mainApp');
    if (!mainApp) return;

    const appShell = document.createElement('div');
    appShell.id = 'appShell';

    // Sisipkan sidebar + toggle
    appShell.insertAdjacentHTML('beforeend', MENU_HTML);

    // Masukkan appShell sebelum mainApp
    mainApp.parentNode.insertBefore(appShell, mainApp);

    // Ambil contentWrap
    const contentWrap = appShell.querySelector('#contentWrap');

    // Pindahkan mainApp ke dalam contentWrap
    contentWrap.appendChild(mainApp); 

    // Set CSS wrapper
    document.body.style.overflowX = 'hidden';

    // Toggle logic
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('open');

    toggleBtn.addEventListener('click', () => {

  if (sidebar.classList.contains('open')) {

    sidebar.classList.remove('open');
    sidebar.classList.add('closed');

    mainApp.style.marginLeft = '0';
    mainApp.style.width = '100%';

  } else {

    sidebar.classList.remove('closed');
    sidebar.classList.add('open');

    mainApp.style.marginLeft = '260px';
    mainApp.style.width = 'calc(100% - 260px)';
  }

});

    // Close sidebar on click outside (mobile)
    document.addEventListener('click', (e) => {
      if (!sidebar || !toggleBtn) return;
      const isMobile = window.innerWidth < 992;
      if (!isMobile) return;
      const clickedInside = sidebar.contains(e.target) || toggleBtn.contains(e.target);
      if (!clickedInside) sidebar.classList.remove('open');
      sidebar.classList.add('closed');
    });

    updateAdminLinkVisibility();
  }

  function updateAdminLinkVisibility() {
    const role = localStorage.getItem('userRole');
    const link = document.getElementById('sidebarAdminLink');
    if (!link) return;
    link.classList.toggle('d-none', role !== 'admin');
  }

  function setActive(module) {
    const navLinks = document.querySelectorAll('#sidebarNav .nav-link');
    navLinks.forEach(a => {
      const m = a.getAttribute('data-module');
      if (m === module) a.classList.add('active');
      else a.classList.remove('active');
    });
  }

  // Hook module function supaya sidebar aktif sinkron
  function bindSidebarNavigation() {

  const map = {
    showDashboard: 'dashboard',
    showAcademic: 'academic',
    showManagement: 'management',
    showReports: 'reports',
    showTasks: 'tasks'
  };

  Object.keys(map).forEach(fnName => {

    const original = window[fnName];

    if (typeof original !== 'function') return;

    window[fnName] = function () {

      // aktifkan menu sidebar
      setActive(map[fnName]);

      // close sidebar di mobile
      if (window.innerWidth < 992) {
        document.getElementById('sidebar')
          ?.classList.add('collapsed');
      }

      // jalankan function asli
      return original.apply(this, arguments);
    };

  });
}

  document.addEventListener('DOMContentLoaded', () => {
    // prevent double init if somehow script loaded twice
    if (window.__TASK_SIDEMENU_HOOKED__) return;
    window.__TASK_SIDEMENU_HOOKED__ = true;

    // prevent multiple DOM wraps
    if (!document.getElementById('appShell')) {
      setupLayoutWrap();
    }


    // Default active
    setActive('dashboard');

    bindSidebarNavigation();
    const sidebar = document.getElementById('sidebar');

    if (window.innerWidth >= 992) {
      sidebar.classList.add('open');
    } else {
      sidebar.classList.add('closed');
    }

    // default sidebar desktop terbuka
    if (window.innerWidth < 992) {
      document.getElementById('sidebar')
      ?.classList.add('collapsed');
  }

    // showTasks exists di script_tasks.js
    updateAdminLinkVisibility();
  });
})();

