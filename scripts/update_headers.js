const fs = require('fs');
const path = require('path');

const files = ['reports.html', 'doctor.html', 'services.html', 'progress.html'];

const replacementHeader = `<div class="notification-wrap">
      <button class="notification-btn" id="bell" title="Notifications">
       🔔
       <span class="notification-badge" id="notifBadge">2</span>
      </button>
      <div class="notif-panel" id="notifPanel" hidden>
       <div class="notif-panel-header">
        <h3>🔔 Notifications</h3>
        <button class="clear-btn" id="clearNotifs">Clear</button>
       </div>
       <div class="notif-body" id="notifList"></div>
      </div>
     </div>
     <div class="user-menu-container">
      <div class="user" id="userMenuToggle">
       <span class="avatar">A</span>
       <span id="userNameDisplay">Avishkar &#x2304;</span>
      </div>
      <div class="profile-dropdown" id="profileDropdown" hidden>
       <div class="profile-dropdown-header">
        <strong id="ddFullName">Avishkar</strong>
        <small id="ddEmail">avishkar@example.com</small>
        <span class="role-tag" id="ddRole">Patient</span>
       </div>
       <ul class="profile-dropdown-list">
        <li><button type="button" id="openProfileBtn">👤 Profile</button></li>
        <li><button type="button" id="openChangePassBtn">🔑 Change Password</button></li>
        <li><a href="doctor-dashboard.html">🩺 Switch to Doctor Portal</a></li>
        <li><a href="admin-dashboard.html">📊 Switch to Admin Portal</a></li>
        <li class="divider"></li>
        <li class="logout-item"><button type="button" id="dropdownLogoutBtn">🚪 Log Out</button></li>
       </ul>
      </div>
     </div>`;

files.forEach(fileName => {
    const filePath = path.join(__dirname, '..', fileName);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Remove logout button from sidebar
    content = content.replace(/<button[^>]*id=["']logout["'][^>]*>[\s\S]*?<\/button>/gi, '');
    content = content.replace(/<a[^>]*href=["']login\.html["'][^>]*>\s*♙\s*My Profile\s*<\/a>/gi, '<button class="out" id="openProfileSidebarBtn" style="border:none;background:transparent;cursor:pointer">♙ My Profile</button>');

    // Replace bell and user container if profileDropdown not already present
    if (!content.includes('id="profileDropdown"')) {
        content = content.replace(/<button[^>]*id=["']bell["'][^>]*>[\s\S]*?<div class=["']user["']>[\s\S]*?<\/div>/i, replacementHeader);
    }

    fs.writeFileSync(filePath, content, 'utf8');

    const staticPath = path.join(__dirname, '..', 'backend', 'src', 'main', 'resources', 'static', fileName);
    if (fs.existsSync(path.dirname(staticPath))) {
        fs.writeFileSync(staticPath, content, 'utf8');
    }

    console.log('Updated:', fileName);
});
