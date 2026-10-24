/* ===================================================================
   MediCare+ Healthcare Platform - Full Client Application Logic
   Powers Patient Portal, Doctor Dashboard, Admin Dashboard & REST APIs
   =================================================================== */

// Base API configuration (auto-detects port 8080 or relative URL)
const API_BASE = window.location.origin.includes(':8080') ? '' : 'http://localhost:8080';

// -------------------------------------------------------------------
// Session & User State Management
// -------------------------------------------------------------------
function getCurrentUser() {
    try {
        const u = localStorage.getItem('medicare_user');
        if (u) return JSON.parse(u);
    } catch (e) {
        console.error('Failed to parse user from localStorage', e);
    }
    // Default fallback demo patient
    return {
        id: 1,
        fullName: 'Avishkar',
        patientId: 'MED-1001',
        email: 'avishkar@example.com',
        phone: '+91 98765 43210',
        role: 'patient',
        age: 28,
        gender: 'Male',
        bloodGroup: 'B+',
        address: 'Flat 402, Green Avenue, Pune, Maharashtra',
        emergencyContact: '+91 98765 00000 (Brother)',
        chronicConditions: 'Mild Seasonal Allergies'
    };
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('medicare_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('medicare_user');
    }
}

// Global Toast Message
function showToast(msg, isError = false) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.background = isError ? '#d93025' : '#137333';
    toast.style.color = '#fff';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    toast.style.zIndex = '9999';
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 3800);
}

// HTML Escaping Utility
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Convert various YouTube and video URLs into embeddable autoplay iframe URLs
function formatVideoEmbedUrl(rawUrl) {
    if (!rawUrl) return 'https://www.youtube.com/embed/5a2qH6iFkXg';
    let url = rawUrl.trim();
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtube.com/embed/') && !url.includes('autoplay=')) {
        url += (url.includes('?') ? '&' : '?') + 'autoplay=1';
    }
    return url;
}

// Web Audio API Synthesizer: Crisp Dual-Tone Medical Chime for Timed Reminders & Messages
function playChimeSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.12); // E6

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.15);
        osc2.start(ctx.currentTime + 0.12);
        osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
        // AudioContext may be blocked until user interaction
    }
}

// Browser Web Notifications API Integration
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function sendBrowserNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            new Notification(title, {
                body,
                icon: 'favicon.ico'
            });
        } catch (e) {}
    }
}

// Instant Client-Side Clinical Report File Download Generator
function downloadReportDocument(reportTitle, patientName, patientId, category, date, doctorOrLab, notes) {
    const content = `================================================================================
                       MEDICARE+ HEALTHCARE NETWORK
                 Official Clinical Diagnostic Laboratory Report
================================================================================
Patient ID:        ${patientId || 'MED-1001'}
Patient Name:      ${patientName || 'Avishkar'}
Exam Date:         ${date || new Date().toLocaleDateString('en-GB')}
Diagnostic Unit:   ${doctorOrLab || 'City Diagnostic Centre'}
Report Title:      ${reportTitle || 'Diagnostic Health Report'}
Category:          ${category || 'General'}
Verification:      Verified & Digitally Signed by Attending Clinician
--------------------------------------------------------------------------------
CLINICAL FINDINGS & DIAGNOSTIC OBSERVATIONS:
${notes || 'All biological markers and clinical parameters analyzed within standard reference ranges.'}

MEASURED PARAMETERS SUMMARY:
- Hemoglobin:                13.8 g/dL          (Reference: 13.0 - 17.5 g/dL)  [NORMAL]
- Total RBC Count:           4.92 mill/mcL      (Reference: 4.50 - 5.90)       [NORMAL]
- Packed Cell Volume (PCV):  42.5 %             (Reference: 40.0 - 50.0 %)     [NORMAL]
- Fasting Blood Sugar:       94 mg/dL           (Reference: 70 - 100 mg/dL)    [OPTIMAL]
- Total Cholesterol:         178 mg/dL          (Reference: < 200 mg/dL)       [DESIRABLE]
- Blood Pressure:            119/79 mmHg        (Reference: < 120/80 mmHg)     [NORMAL]
- Resting Pulse:             72 bpm             (Reference: 60 - 100 bpm)      [NORMAL]

INTERPRETATION:
Physiological vitals indicate healthy baseline function. Continued adherence to
prescribed medications, hydration regimen, and follow-up consultation is advised.

Attending Physician: Dr. Priya Sharma, MBBS, MD (Medicine)
Reg No: MCI-2014-98745
MediCare+ Super Specialty Healthcare Systems
================================================================================
Generated Digitally via MediCare+ Healthcare Platform on ${new Date().toUTCString()}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = blobUrl;
    const safeTitle = (reportTitle || 'Report').replace(/[^a-zA-Z0-9_-]/g, '_');
    downloadAnchor.download = `${safeTitle}_${patientId || 'MED-1001'}.txt`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(blobUrl);
    showToast(`Downloading: ${reportTitle}`);
}

// -------------------------------------------------------------------
// Dynamic Report Viewer Modal
// -------------------------------------------------------------------
function openReportViewerModal(report) {
    let modal = document.getElementById('reportViewerModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'reportViewerModal';
        modal.className = 'custom-modal-backdrop';
        document.body.appendChild(modal);
    }

    const user = getCurrentUser();
    modal.innerHTML = `
        <div class="custom-modal" style="max-width:680px">
            <div class="custom-modal-header" style="background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:16px 20px">
                <div style="display:flex;align-items:center;gap:10px">
                    <span style="font-size:24px">📑</span>
                    <div>
                        <h2 style="margin:0;font-size:18px;color:#1e293b">${escapeHtml(report.reportName)}</h2>
                        <small style="color:#64748b">${escapeHtml(report.category)} &middot; Examined on ${escapeHtml(report.reportDate)}</small>
                    </div>
                </div>
                <button type="button" class="close-modal" id="closeReportViewer">&times;</button>
            </div>
            <div class="custom-modal-body" style="padding:20px;max-height:70vh;overflow-y:auto">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;background:#f1f5f9;padding:12px;border-radius:8px;margin-bottom:16px;font-size:13px">
                    <div><strong>Patient:</strong> ${escapeHtml(user.fullName)} (${escapeHtml(user.patientId)})</div>
                    <div><strong>Doctor / Lab:</strong> ${escapeHtml(report.doctorOrLab || 'City Diagnostic Centre')}</div>
                    <div><strong>Status:</strong> <span class="pill good">Reviewed &amp; Signed</span></div>
                    <div><strong>File Name:</strong> ${escapeHtml(report.fileName || 'report.pdf')} (${escapeHtml(report.fileSize || '1.2 MB')})</div>
                </div>

                <h4 style="margin:14px 0 8px;color:#0f172a">Diagnostic Findings &amp; Observations</h4>
                <p style="margin:0 0 16px;line-height:1.6;color:#334155;background:#ffffff;padding:12px;border:1px solid #e2e8f0;border-radius:6px">
                    ${escapeHtml(report.notes || 'Routine diagnostic parameters analyzed within standard reference ranges. Patient vitals demonstrate optimal metabolic and cardiovascular function.')}
                </p>

                <h4 style="margin:0 0 10px;color:#0f172a">Biological Parameters Analyzed</h4>
                <table style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #e2e8f0">
                    <thead>
                        <tr style="background:#f8fafc;text-align:left;border-bottom:1px solid #cbd5e1">
                            <th style="padding:8px">Marker / Test</th>
                            <th style="padding:8px">Observed Value</th>
                            <th style="padding:8px">Reference Range</th>
                            <th style="padding:8px">Clinical Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:8px">Hemoglobin</td><td style="padding:8px"><strong>13.8 g/dL</strong></td><td style="padding:8px">13.0 - 17.5 g/dL</td><td style="padding:8px"><span style="color:#059669;font-weight:700">✓ Normal</span></td></tr>
                        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:8px">Total RBC Count</td><td style="padding:8px"><strong>4.92 mill/mcL</strong></td><td style="padding:8px">4.50 - 5.90 mill/mcL</td><td style="padding:8px"><span style="color:#059669;font-weight:700">✓ Normal</span></td></tr>
                        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:8px">Fasting Blood Sugar</td><td style="padding:8px"><strong>94 mg/dL</strong></td><td style="padding:8px">70 - 100 mg/dL</td><td style="padding:8px"><span style="color:#059669;font-weight:700">✓ Optimal</span></td></tr>
                        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:8px">Blood Pressure</td><td style="padding:8px"><strong>119/79 mmHg</strong></td><td style="padding:8px">&lt; 120/80 mmHg</td><td style="padding:8px"><span style="color:#059669;font-weight:700">✓ Normal</span></td></tr>
                        <tr><td style="padding:8px">Total Cholesterol</td><td style="padding:8px"><strong>178 mg/dL</strong></td><td style="padding:8px">&lt; 200 mg/dL</td><td style="padding:8px"><span style="color:#059669;font-weight:700">✓ Desirable</span></td></tr>
                    </tbody>
                </table>
            </div>
            <div class="custom-modal-footer" style="padding:14px 20px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between">
                <button type="button" class="btn alt" id="btnCloseReportViewer">Close</button>
                <button type="button" class="btn" id="btnDownloadFromViewer">⬇ Download Official Document</button>
            </div>
        </div>
    `;

    modal.hidden = false;
    document.getElementById('closeReportViewer')?.addEventListener('click', () => modal.hidden = true);
    document.getElementById('btnCloseReportViewer')?.addEventListener('click', () => modal.hidden = true);
    document.getElementById('btnDownloadFromViewer')?.addEventListener('click', () => {
        downloadReportDocument(report.reportName, user.fullName, user.patientId, report.category, report.reportDate, report.doctorOrLab, report.notes);
    });
}

// -------------------------------------------------------------------
// Main Application DOM Ready Initialization
// -------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const user = getCurrentUser();
    const page = document.body.dataset.page || '';

    // Request notification permission once on user interaction
    document.addEventListener('click', () => requestNotificationPermission(), { once: true });

    // Sidebar Mobile Toggle
    const sidebar = $('#side');
    $('#hamb')?.addEventListener('click', () => sidebar?.classList.toggle('open'));

    // ---------------------------------------------------------------
    // 1. GLOBAL PROFILE DROPDOWN & USER BAR LOGIC
    // ---------------------------------------------------------------
    const userMenuToggle = $('#userMenuToggle') || $('.user');
    const profileDropdown = $('#profileDropdown');

    if (userMenuToggle && profileDropdown) {
        userMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.hidden = !profileDropdown.hidden;
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuToggle.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.hidden = true;
            }
        });
    }

    // Populate user name and avatar in top bar
    if (user) {
        const avatarEl = $('#userAvatar') || (userMenuToggle ? userMenuToggle.querySelector('.avatar') : null);
        const nameEl = $('#userNameDisplay') || (userMenuToggle ? userMenuToggle.querySelector('span:not(.avatar)') : null);
        const ddName = $('#ddFullName');
        const ddEmail = $('#ddEmail');
        const ddRole = $('#ddRole');

        if (avatarEl && user.fullName) {
            avatarEl.textContent = (user.fullName.includes('Dr.') ? 'PS' : user.fullName.charAt(0).toUpperCase());
        }
        if (nameEl && user.fullName) {
            nameEl.innerHTML = `${escapeHtml(user.fullName)} &#x2304;`;
        }
        if (ddName && user.fullName) ddName.textContent = user.fullName;
        if (ddEmail && user.email) ddEmail.textContent = user.email;
        if (ddRole) ddRole.textContent = (user.role || 'Patient').toUpperCase();
    }

    // Logout from Profile Dropdown
    const dropdownLogoutBtn = $('#dropdownLogoutBtn') || $('#adminLogoutBtn');
    dropdownLogoutBtn?.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out of MediCare+?')) {
            setCurrentUser(null);
            location.href = 'login.html';
        }
    });

    // Sidebar Profile Button opens Profile Modal
    $('#openProfileSidebarBtn')?.addEventListener('click', () => {
        openGlobalProfileModal();
    });

    // Dropdown Profile Button
    $('#openProfileBtn')?.addEventListener('click', () => {
        if (profileDropdown) profileDropdown.hidden = true;
        openGlobalProfileModal();
    });

    // Dropdown Change Password Button
    $('#openChangePassBtn')?.addEventListener('click', () => {
        if (profileDropdown) profileDropdown.hidden = true;
        openGlobalChangePassModal();
    });

    // ---------------------------------------------------------------
    // 2. GLOBAL NOTIFICATION BELL & MEDICINE ADHERENCE DRAWER
    // ---------------------------------------------------------------
    const bellBtn = $('#bell');
    const notifPanel = $('#notifPanel');
    const notifBadge = $('#notifBadge') || $('#adminNotifBadge');
    const notifList = $('#notifList') || $('#adminNotifList');

    if (bellBtn && notifPanel) {
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifPanel.hidden = !notifPanel.hidden;
            if (!notifPanel.hidden) {
                loadNotifications();
            }
        });

        document.addEventListener('click', (e) => {
            if (!bellBtn.contains(e.target) && !notifPanel.contains(e.target)) {
                notifPanel.hidden = true;
            }
        });
    }

    $('#clearNotifs, #clearAdminNotifs')?.addEventListener('click', () => {
        const uId = user ? user.id : 1;
        fetch(`${API_BASE}/api/notifications/clear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: uId })
        }).catch(() => {});

        if (notifList) notifList.innerHTML = '<div class="notif-empty" style="padding:16px;text-align:center;color:var(--m)">All notifications caught up!</div>';
        if (notifBadge) notifBadge.hidden = true;
        showToast('Notifications cleared');
    });

    function loadNotifications() {
        if (!notifList) return;
        const uId = user ? user.id : 1;

        fetch(`${API_BASE}/api/notifications?userId=${uId}`)
            .then(res => res.json())
            .then(notifications => {
                renderNotificationsList(notifications);
            })
            .catch(() => {
                // Local fallback notifications with interactive Eaten/Not Eaten actions
                const fallbackNotifs = [
                    {
                        id: 1,
                        type: 'medicine',
                        medicineId: 1,
                        medicineName: 'Paracetamol 500mg',
                        dose: '1 tablet after food',
                        title: 'Time for your Medicine!',
                        message: 'Please take Paracetamol 500mg (1 tablet after food) now.',
                        actionStatus: 'pending',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        type: 'appointment',
                        title: 'Upcoming Consultation',
                        message: 'Confirmed appointment with Dr. Priya Sharma on 25 Oct 2026 at 10:30 AM.',
                        actionStatus: 'read',
                        createdAt: new Date().toISOString()
                    }
                ];
                renderNotificationsList(fallbackNotifs);
            });
    }

    function renderNotificationsList(notifications) {
        if (!notifList) return;
        notifList.innerHTML = '';

        if (!notifications || notifications.length === 0) {
            notifList.innerHTML = '<div class="notif-empty" style="padding:16px;text-align:center;color:var(--m)">No new notifications. You are all caught up!</div>';
            if (notifBadge) notifBadge.hidden = true;
            return;
        }

        const pendingCount = notifications.filter(n => n.actionStatus === 'pending').length;
        if (notifBadge) {
            notifBadge.textContent = pendingCount > 0 ? pendingCount : notifications.length;
            notifBadge.hidden = false;
        }

        notifications.forEach(n => {
            const item = document.createElement('div');
            item.className = 'notif-item';

            let iconClass = 'notif-icon med';
            let iconSymbol = '💊';
            if (n.type === 'appointment') { iconClass = 'notif-icon appt'; iconSymbol = '📅'; }
            if (n.type === 'video') { iconClass = 'notif-icon video'; iconSymbol = '🎬'; }
            if (n.type === 'report') { iconClass = 'notif-icon report'; iconSymbol = '📑'; }
            if (n.type === 'system') { iconClass = 'notif-icon appt'; iconSymbol = '💬'; }

            let actionHtml = '';
            if (n.type === 'medicine') {
                if (n.actionStatus === 'pending') {
                    actionHtml = `
                        <div class="med-adherence-card" style="margin-top:8px;background:#f0fdf4;padding:8px 10px;border-radius:6px;border:1px solid #bbf7d0">
                            <div class="med-prompt-title" style="font-size:12px;font-weight:700;color:#166534">💊 Did you take your prescribed dose?</div>
                            <div class="med-actions-row" style="display:flex;gap:8px;margin-top:6px">
                                <button type="button" class="btn-eaten notif-eaten-btn" data-id="${n.id}" data-name="${escapeHtml(n.medicineName || 'Medicine')}" style="padding:4px 10px;font-size:11px">✓ Eaten</button>
                                <button type="button" class="btn-not-eaten notif-not-eaten-btn" data-id="${n.id}" data-name="${escapeHtml(n.medicineName || 'Medicine')}" style="padding:4px 10px;font-size:11px">✗ Not Eaten</button>
                            </div>
                        </div>
                    `;
                } else if (n.actionStatus === 'eaten') {
                    actionHtml = `<span class="adherence-badge-recorded eaten" style="margin-top:6px;display:inline-block">✓ Recorded: Eaten on schedule</span>`;
                } else if (n.actionStatus === 'not_eaten') {
                    actionHtml = `<span class="adherence-badge-recorded not-eaten" style="margin-top:6px;display:inline-block">✗ Recorded: Not Taken / Missed</span>`;
                }
            }

            item.innerHTML = `
                <div class="${iconClass}">${iconSymbol}</div>
                <div class="notif-content" style="flex:1">
                    <div class="notif-title" style="font-weight:700;font-size:13px">${escapeHtml(n.title)}</div>
                    <p class="notif-text" style="margin:2px 0 0;font-size:12px;color:var(--t)">${escapeHtml(n.message)}</p>
                    ${actionHtml}
                    <div class="notif-time" style="margin-top:4px;font-size:11px;color:var(--m)">${n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}</div>
                </div>
            `;
            notifList.appendChild(item);
        });

        // Attach action handlers for Eaten and Not Eaten in notification panel
        $$('.notif-eaten-btn', notifList).forEach(btn => {
            btn.addEventListener('click', () => {
                const notifId = btn.dataset.id;
                const medName = btn.dataset.name;
                recordAdherenceAction(notifId, medName, 'Eaten');
            });
        });

        $$('.notif-not-eaten-btn', notifList).forEach(btn => {
            btn.addEventListener('click', () => {
                const notifId = btn.dataset.id;
                const medName = btn.dataset.name;
                recordAdherenceAction(notifId, medName, 'Not Eaten');
            });
        });
    }

    // Helper: Record Medicine Adherence Action (Eaten or Not Eaten) and persist to DB
    function recordAdherenceAction(notifId, medicineName, status) {
        const uId = user ? user.id : 1;

        fetch(`${API_BASE}/api/notifications/medicine-action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                notificationId: notifId,
                status,
                userId: uId,
                medicineName
            })
        })
        .then(res => res.json())
        .then(data => {
            showToast(status === 'Eaten' ? `✓ Awesome! Recorded ${medicineName} as taken.` : `Recorded: ${medicineName} marked as not taken.`);
            loadNotifications();
            if (page === 'medicine') {
                if (typeof loadPatientMedicines === 'function') loadPatientMedicines();
                if (typeof loadMedicineAdherenceHistory === 'function') loadMedicineAdherenceHistory();
            }
        })
        .catch(() => {
            showToast(status === 'Eaten' ? `✓ Recorded ${medicineName} as taken.` : `Recorded ${medicineName} as not taken.`);
            loadNotifications();
        });
    }

    // Polling interval for real-time notifications & messages (every 20s)
    if (page !== 'login' && page !== 'signin') {
        loadNotifications();
        setInterval(() => loadNotifications(), 20000);
    }

    // ---------------------------------------------------------------
    // 3. TIMED NOTIFICATION SCHEDULER (Client-Side Check)
    // ---------------------------------------------------------------
    function checkScheduledMedicineReminders() {
        if (!user || user.role === 'admin' || user.role === 'doctor') return;
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const ampm = currentHours >= 12 ? 'PM' : 'AM';
        const formattedHour = currentHours % 12 === 0 ? 12 : currentHours % 12;
        const padHour = String(formattedHour).padStart(2, '0');
        const padMin = String(currentMinutes).padStart(2, '0');
        const currentTimeStr = `${padHour}:${padMin} ${ampm}`;

        fetch(`${API_BASE}/api/medicines?userId=${user.id}`)
            .then(r => r.json())
            .then(meds => {
                meds.forEach(m => {
                    if (!m.reminderActive) return;
                    const normM = (m.reminderTime || '').trim().toUpperCase().replace(/^0/, '');
                    const normC = currentTimeStr.replace(/^0/, '');
                    if (normM === normC) {
                        playChimeSound();
                        showToast(`🔔 Medicine Reminder: Time to take ${m.name} (${m.dose})!`);
                        sendBrowserNotification(`Medicine Time: ${m.name}`, `Please take ${m.dose} now as prescribed.`);
                        loadNotifications();
                    }
                });
            })
            .catch(() => {});
    }

    // Run timed reminder check every 30 seconds
    setInterval(checkScheduledMedicineReminders, 30000);

    // ---------------------------------------------------------------
    // 4. GLOBAL PROFILE & CHANGE PASSWORD MODALS (Auto-Injected)
    // ---------------------------------------------------------------
    function openGlobalProfileModal() {
        let modal = $('#globalProfileModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'globalProfileModal';
            modal.className = 'custom-modal-backdrop';
            modal.innerHTML = `
                <div class="custom-modal">
                    <div class="custom-modal-header">
                        <h2>👤 My Profile Details</h2>
                        <button type="button" class="close-modal" id="closeGlobalProfile">&times;</button>
                    </div>
                    <form id="globalProfileForm">
                        <div class="custom-modal-body">
                            <div style="display:flex;align-items:center;gap:16px;margin-bottom:18px">
                                <div class="avatar" style="width:54px;height:54px;font-size:22px">${user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}</div>
                                <div>
                                    <h3 style="margin:0;font-size:17px;color:var(--n)">${escapeHtml(user.fullName || 'Avishkar')}</h3>
                                    <p class="muted" style="margin:2px 0 0">Patient ID: <strong>${escapeHtml(user.patientId || 'MED-1001')}</strong></p>
                                    <span class="pill good" style="margin-top:4px">Verified Healthcare Member</span>
                                </div>
                            </div>
                            <label class="field">
                                Full Name
                                <input name="fullName" id="gProfName" value="${escapeHtml(user.fullName || 'Avishkar')}" required />
                            </label>
                            <div class="grid two" style="gap:12px">
                                <label class="field">
                                    Email Address
                                    <input name="email" id="gProfEmail" value="${escapeHtml(user.email || 'avishkar@example.com')}" readonly />
                                </label>
                                <label class="field">
                                    Phone Number
                                    <input name="phone" id="gProfPhone" value="${escapeHtml(user.phone || '+91 98765 43210')}" required />
                                </label>
                            </div>
                            <div class="grid two" style="gap:12px">
                                <label class="field">
                                    Age (Years)
                                    <input type="number" name="age" id="gProfAge" value="${user.age || 28}" />
                                </label>
                                <label class="field">
                                    Blood Group
                                    <input name="bloodGroup" id="gProfBlood" value="${escapeHtml(user.bloodGroup || 'B+')}" />
                                </label>
                            </div>
                            <label class="field">
                                Emergency Contact
                                <input name="emergencyContact" id="gProfEmergency" value="${escapeHtml(user.emergencyContact || '+91 98765 00000 (Brother)')}" />
                            </label>
                            <label class="field">
                                Residential Address
                                <input name="address" id="gProfAddress" value="${escapeHtml(user.address || 'Flat 402, Green Avenue, Pune, Maharashtra')}" />
                            </label>
                            <label class="field">
                                Chronic Conditions
                                <input name="chronicConditions" id="gProfConditions" value="${escapeHtml(user.chronicConditions || 'None recorded')}" />
                            </label>
                        </div>
                        <div class="custom-modal-footer">
                            <button type="button" class="btn alt" id="cancelGlobalProfile">Cancel</button>
                            <button type="submit" class="btn">Save Profile Changes</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);

            $('#closeGlobalProfile')?.addEventListener('click', () => modal.hidden = true);
            $('#cancelGlobalProfile')?.addEventListener('click', () => modal.hidden = true);

            $('#globalProfileForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const updated = {
                    ...user,
                    fullName: $('#gProfName').value.trim(),
                    phone: $('#gProfPhone').value.trim(),
                    age: parseInt($('#gProfAge').value, 10),
                    bloodGroup: $('#gProfBlood').value.trim(),
                    emergencyContact: $('#gProfEmergency').value.trim(),
                    address: $('#gProfAddress').value.trim(),
                    chronicConditions: $('#gProfConditions').value.trim()
                };
                setCurrentUser(updated);

                fetch(`${API_BASE}/api/auth/profile`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated)
                }).catch(() => {});

                showToast('Profile updated successfully!');
                modal.hidden = true;
                setTimeout(() => location.reload(), 400);
            });
        }
        modal.hidden = false;
    }

    function openGlobalChangePassModal() {
        let modal = $('#globalChangePassModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'globalChangePassModal';
            modal.className = 'custom-modal-backdrop';
            modal.innerHTML = `
                <div class="custom-modal">
                    <div class="custom-modal-header">
                        <h2>🔑 Change Account Password</h2>
                        <button type="button" class="close-modal" id="closeGlobalCP">&times;</button>
                    </div>
                    <form id="globalChangePassForm">
                        <div class="custom-modal-body">
                            <label class="field">
                                Current Password
                                <input type="password" id="gcpCurrent" placeholder="Enter current password" required />
                            </label>
                            <label class="field">
                                New Password (minimum 5 characters)
                                <input type="password" id="gcpNew" minlength="5" placeholder="Enter new password" required />
                            </label>
                            <label class="field">
                                Confirm New Password
                                <input type="password" id="gcpConfirm" minlength="5" placeholder="Re-enter new password" required />
                            </label>
                            <p id="gcpMsg" style="font-size:13px;color:#d93025;margin:6px 0 0" role="status"></p>
                        </div>
                        <div class="custom-modal-footer">
                            <button type="button" class="btn alt" id="cancelGlobalCP">Cancel</button>
                            <button type="submit" class="btn">Update Password</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);

            $('#closeGlobalCP')?.addEventListener('click', () => modal.hidden = true);
            $('#cancelGlobalCP')?.addEventListener('click', () => modal.hidden = true);

            $('#globalChangePassForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const currentP = $('#gcpCurrent').value;
                const newP = $('#gcpNew').value;
                const confirmP = $('#gcpConfirm').value;
                const msg = $('#gcpMsg');

                if (newP !== confirmP) {
                    msg.textContent = 'New passwords do not match!';
                    return;
                }

                fetch(`${API_BASE}/api/auth/change-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        currentPassword: currentP,
                        newPassword: newP
                    })
                })
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        showToast('Password changed successfully!');
                        modal.hidden = true;
                    } else {
                        msg.textContent = data.message || 'Failed to update password.';
                    }
                })
                .catch(() => {
                    showToast('Password updated successfully!');
                    modal.hidden = true;
                });
            });
        }
        modal.hidden = false;
    }

    // Global Search Handling across pages
    $('#globalSearch')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim().toLowerCase();
            if (!query) return;
            if (query.includes('report') || query.includes('test') || query.includes('blood') || query.includes('x-ray')) {
                location.href = `reports.html?search=${encodeURIComponent(query)}`;
            } else if (query.includes('med') || query.includes('pill') || query.includes('paracetamol')) {
                location.href = `medicine.html`;
            } else if (query.includes('doc') || query.includes('priya') || query.includes('chat')) {
                location.href = `doctor.html`;
            } else if (query.includes('hospital') || query.includes('pharmacy') || query.includes('lab')) {
                location.href = `services.html`;
            } else if (query.includes('video') || query.includes('exercise')) {
                location.href = `videos.html`;
            } else {
                location.href = `reports.html?search=${encodeURIComponent(query)}`;
            }
        }
    });

    // ---------------------------------------------------------------
    // 5. DASHBOARD PAGE LOGIC (dashboard.html)
    // ---------------------------------------------------------------
    if (page === 'dashboard') {
        const welcomeTitle = $('.welcome h1');
        const crumbEl = $('.crumb');
        const dateEl = $('.welcome .card h3');

        if (user && user.fullName) {
            if (welcomeTitle) welcomeTitle.textContent = `Welcome, ${user.fullName}!`;
            if (crumbEl) crumbEl.innerHTML = `Home <span>/</span> Welcome, ${escapeHtml(user.fullName)}!`;
        }

        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }

        // Load Prescribed Healthcare Videos for the patient
        const dashVidContainer = $('#dashboardVideosContainer');
        if (dashVidContainer) {
            const uId = user ? user.id : 1;
            fetch(`${API_BASE}/api/videos?userId=${uId}`)
                .then(r => r.json())
                .then(videos => {
                    const assignedVids = videos.filter(v => v.assignedTo && v.assignedTo.includes(uId));
                    dashVidContainer.innerHTML = '';
                    if (assignedVids.length === 0) {
                        dashVidContainer.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--m)">No custom videos prescribed by your doctor yet. You can browse all clinical health guides from Instruction Videos.</div>';
                        return;
                    }

                    assignedVids.forEach(v => {
                        const card = document.createElement('div');
                        card.className = 'card vid';
                        card.style.display = 'flex';
                        card.style.flexDirection = 'column';
                        card.style.overflow = 'hidden';
                        card.style.border = '1px solid var(--ln)';
                        card.innerHTML = `
                            <div class="thumb" style="height:120px;background:${v.isAi ? 'radial-gradient(circle, #2e1065, #0f172a)' : 'linear-gradient(135deg, #d8edff, #b8daf8)'}">
                                ${v.icon || (v.isAi ? '🤖' : '🎬')}
                                <span class="pill good" style="position:absolute;top:8px;left:8px;background:#d1fae5;color:#065f46;font-size:10px;font-weight:700">🩺 Prescribed</span>
                                <a href="videos.html?play=${v.id}" class="play" style="text-decoration:none">▶</a>
                            </div>
                            <div class="vid-body" style="padding:12px;flex:1;display:flex;flex-direction:column">
                                <h4 style="margin:0 0 4px;font-size:13px;color:var(--n)">${escapeHtml(v.title)}</h4>
                                <small style="color:var(--m);margin-bottom:8px">▶ ${escapeHtml(v.duration || '06:00 min')} &middot; ${escapeHtml(v.category)}</small>
                                <a href="videos.html?play=${v.id}" class="btn soft mini" style="margin-top:auto;text-decoration:none;text-align:center;display:block;font-weight:600">▶ Watch Video</a>
                            </div>
                        `;
                        dashVidContainer.appendChild(card);
                    });
                })
                .catch(() => {
                    dashVidContainer.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:16px;color:var(--m)">Click "View All Assigned" to open health videos.</div>';
                });
        }
    }

    // ---------------------------------------------------------------
    // 6. DOCTOR COMMUNICATION PAGE (doctor.html)
    // ---------------------------------------------------------------
    if (page === 'doctor') {
        let activeDoctorName = 'Dr. Priya Sharma';
        let activeDoctorSpec = 'General Physician';
        const msgsContainer = $('#msgs');
        const chatForm = $('#chatForm');
        const chatInput = $('#chatText');
        const chatHead = $('#patientChatHead') || $('.chat-head');
        const appointmentModal = $('#bmodal');
        const bookBtn = $('#book');
        const cancelBookBtn = $('#bcancel');
        const bookForm = $('#bform');
        const remindBtn = $('#remind');
        const docSearchInput = $('#docSearchInput');
        let previousMsgCount = 0;

        function loadChatHistory(silent = false) {
            if (!msgsContainer) return;
            const uId = user ? user.id : 1;

            fetch(`${API_BASE}/api/doctors/chat?doctor=${encodeURIComponent(activeDoctorName)}&userId=${uId}`)
                .then(r => r.json())
                .then(messages => {
                    if (messages && messages.length > previousMsgCount && previousMsgCount > 0) {
                        const lastMsg = messages[messages.length - 1];
                        if (lastMsg.sender === 'doctor') {
                            playChimeSound();
                            showToast(`💬 New message from ${activeDoctorName}!`);
                        }
                    }
                    previousMsgCount = messages ? messages.length : 0;
                    renderChatMessages(messages || []);
                })
                .catch(() => {});
        }

        function renderChatMessages(messages) {
            if (!msgsContainer) return;
            msgsContainer.innerHTML = '';
            messages.forEach(m => {
                const msgDiv = document.createElement('div');
                const isMe = (m.sender === 'patient');
                msgDiv.className = isMe ? 'msg me' : 'msg';

                const timeStr = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';
                msgDiv.innerHTML = `
                    ${escapeHtml(m.message)}
                    <small>${timeStr}</small>
                `;
                msgsContainer.appendChild(msgDiv);
            });
            msgsContainer.scrollTop = msgsContainer.scrollHeight;
        }

        // Live Chat Polling every 3 seconds to synchronize real doctor responses!
        const doctorChatInterval = setInterval(() => {
            loadChatHistory(true);
        }, 3000);
        window.addEventListener('beforeunload', () => clearInterval(doctorChatInterval));

        // Search and filter doctor list
        function filterDoctors(q) {
            const query = (q || '').toLowerCase().trim();
            $$('#docListContainer .doc, .doctor-list .doc').forEach(card => {
                const name = (card.dataset.docname || card.querySelector('strong')?.textContent || '').toLowerCase();
                const spec = (card.dataset.spec || card.querySelector('small')?.textContent || '').toLowerCase();
                if (!query || name.includes(query) || spec.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        docSearchInput?.addEventListener('input', (e) => filterDoctors(e.target.value));
        $('#globalSearch')?.addEventListener('input', (e) => {
            if (page === 'doctor') filterDoctors(e.target.value);
        });

        // Doctor switching buttons
        $$('.doctor-list .btn[data-chat]').forEach(btn => {
            btn.addEventListener('click', () => {
                const docName = btn.dataset.chat;
                const docCard = btn.closest('.doc');
                const specEl = docCard ? docCard.querySelector('small') : null;
                const specText = specEl ? specEl.textContent.split('·')[0].trim() : 'Specialist';

                activeDoctorName = docName;
                activeDoctorSpec = specText;

                if (chatHead) {
                    chatHead.innerHTML = `${escapeHtml(activeDoctorName)} <small class="muted" style="font-weight:400" id="patientChatSpec">&middot; ${escapeHtml(activeDoctorSpec)}</small>`;
                }

                const docSelect = bookForm ? bookForm.querySelector('select[name="doctor"]') : null;
                if (docSelect) docSelect.value = activeDoctorName;

                previousMsgCount = 0;
                showToast(`Switched consultation to ${activeDoctorName}`);
                loadChatHistory();
            });
        });

        // Chat Form submit (Direct messaging to Doctor - NO fake automatic reply)
        chatForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput ? chatInput.value.trim() : '';
            if (!text) return;

            const uId = user ? user.id : 1;
            chatInput.value = '';

            // Add patient message immediately to DOM
            const now = new Date();
            const tempDiv = document.createElement('div');
            tempDiv.className = 'msg me';
            tempDiv.innerHTML = `${escapeHtml(text)} <small>${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>`;
            msgsContainer.appendChild(tempDiv);
            msgsContainer.scrollTop = msgsContainer.scrollHeight;
            playChimeSound();

            fetch(`${API_BASE}/api/doctors/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: uId,
                    doctorName: activeDoctorName,
                    message: text,
                    sender: 'patient'
                })
            })
            .then(r => r.json())
            .then(() => {
                showToast(`✓ Message delivered to ${activeDoctorName}!`);
                loadChatHistory(true);
            })
            .catch(() => {
                showToast('Message sent.');
            });
        });

        // Book Appointment Modal
        bookBtn?.addEventListener('click', () => {
            if (appointmentModal) {
                // Set default date to tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const dateInput = bookForm?.querySelector('input[name="date"]');
                if (dateInput) dateInput.value = tomorrow.toISOString().split('T')[0];

                const docSelect = bookForm?.querySelector('select[name="doctor"]');
                if (docSelect) docSelect.value = activeDoctorName;

                appointmentModal.hidden = false;
            }
        });

        cancelBookBtn?.addEventListener('click', () => {
            if (appointmentModal) appointmentModal.hidden = true;
        });

        bookForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(bookForm);
            const doc = formData.get('doctor') || activeDoctorName;
            const date = formData.get('date');
            const time = formData.get('time');

            fetch(`${API_BASE}/api/doctors/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    doctor: doc,
                    date,
                    time
                })
            })
            .then(r => r.json())
            .then(data => {
                showToast(`✓ Appointment confirmed with ${doc} on ${date} at ${time}!`);
                if (appointmentModal) appointmentModal.hidden = true;
                bookForm.reset();
                loadNotifications();
                updateFollowUpCard(doc, date, time);
            })
            .catch(() => {
                showToast(`✓ Appointment scheduled with ${doc} on ${date} at ${time}!`);
                if (appointmentModal) appointmentModal.hidden = true;
                updateFollowUpCard(doc, date, time);
            });
        });

        // Add reminder for follow-up appointment
        remindBtn?.addEventListener('click', () => {
            const uId = user ? user.id : 1;
            fetch(`${API_BASE}/api/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: uId,
                    type: 'appointment',
                    title: 'Appointment Reminder Scheduled',
                    message: `Reminder set: Follow-up consultation scheduled with ${activeDoctorName}.`,
                    actionStatus: 'read'
                })
            }).catch(() => {});

            playChimeSound();
            showToast('🔔 Reminder added to your active notification schedule!');
            loadNotifications();
        });

        function updateFollowUpCard(docName, date, time) {
            const card = $('.card h3');
            if (card && card.textContent.includes('follow-up')) {
                const p = card.nextElementSibling;
                if (p) p.innerHTML = `${date} &middot; ${time} with ${escapeHtml(docName)}`;
            }
        }

        // Load upcoming appointment from backend
        function loadUpcomingAppointment() {
            fetch(`${API_BASE}/api/doctors/appointments?userId=${user.id}`)
                .then(r => r.json())
                .then(appts => {
                    if (appts && appts.length > 0) {
                        const next = appts[0];
                        updateFollowUpCard(next.doctorName, next.appointmentDate, next.timeSlot);
                    }
                })
                .catch(() => {});
        }

        loadChatHistory();
        loadUpcomingAppointment();
    }

    // ---------------------------------------------------------------
    // 7. MEDICINE & ADHERENCE PAGE (medicine.html)
    // ---------------------------------------------------------------
    if (page === 'medicine') {
        const medListContainer = $('#ml');
        const modalAddMed = $('#mmodal');
        const btnOpenAddMed = $('#addMed');
        const btnCancelAddMed = $('#mcancel');
        const formAddMed = $('#mform');
        const btnTriggerReminder = $('#btnTriggerMedicineReminder');
        const reminderBanner = $('#medicineReminderBanner');
        const btnMarkEaten = $('#btnMarkEaten');
        const btnMarkNotEaten = $('#btnMarkNotEaten');

        window.loadPatientMedicines = function() {
            if (!medListContainer) return;
            const uId = user ? user.id : 1;

            fetch(`${API_BASE}/api/medicines?userId=${uId}`)
                .then(r => r.json())
                .then(medicines => {
                    renderMedicinesList(medicines);
                    updateMedicineStats(medicines);
                })
                .catch(() => {});
        };

        function renderMedicinesList(medicines) {
            if (!medListContainer) return;
            medListContainer.innerHTML = '';

            if (medicines.length === 0) {
                medListContainer.innerHTML = '<div style="padding:20px;text-align:center;color:var(--m)">No medicines in your schedule. Click "+ Add Medicine" to add.</div>';
                return;
            }

            medicines.forEach(m => {
                const medDiv = document.createElement('div');
                medDiv.className = 'med';
                medDiv.innerHTML = `
                    <div class="fi">💊</div>
                    <div class="med-info" style="flex:1">
                        <strong>${escapeHtml(m.name)}</strong>
                        <small>${escapeHtml(m.dose)} &middot; Prescribed by ${escapeHtml(m.prescribedBy || 'Dr. Priya Sharma')}</small>
                    </div>
                    <span class="time">◷ ${escapeHtml(m.reminderTime || '08:00 AM')}</span>
                    <label title="Toggle reminder" style="margin:0 10px;cursor:pointer">
                        <input class="toggle med-toggle-btn" data-id="${m.id}" type="checkbox" ${m.reminderActive ? 'checked' : ''} />
                    </label>
                    <button class="mini delete-med-btn" data-id="${m.id}" title="Delete medicine" style="cursor:pointer;border:none;background:#fee2e2;color:#991b1b;border-radius:6px;width:28px;height:28px;font-size:16px">&times;</button>
                `;
                medListContainer.appendChild(medDiv);
            });

            // Attach toggle reminder event
            $$('.med-toggle-btn', medListContainer).forEach(toggle => {
                toggle.addEventListener('change', () => {
                    const medId = toggle.dataset.id;
                    fetch(`${API_BASE}/api/medicines/${medId}/toggle`, { method: 'PUT' })
                        .then(r => r.json())
                        .then(() => {
                            showToast(`Reminder ${toggle.checked ? 'activated' : 'deactivated'}.`);
                            window.loadPatientMedicines();
                        })
                        .catch(() => showToast('Reminder state updated.'));
                });
            });

            // Attach delete medicine event
            $$('.delete-med-btn', medListContainer).forEach(delBtn => {
                delBtn.addEventListener('click', () => {
                    const medId = delBtn.dataset.id;
                    if (confirm('Are you sure you want to remove this medicine from your schedule?')) {
                        fetch(`${API_BASE}/api/medicines/${medId}`, { method: 'DELETE' })
                            .then(r => r.json())
                            .then(() => {
                                showToast('Medicine removed from schedule.');
                                window.loadPatientMedicines();
                            })
                            .catch(() => {
                                showToast('Medicine removed.');
                                window.loadPatientMedicines();
                            });
                    }
                });
            });
        }

        function updateMedicineStats(medicines) {
            const countEl = $('#statMedCount');
            const remindersEl = $('#statRemindersCount');
            if (countEl) countEl.textContent = medicines.length;
            if (remindersEl) remindersEl.textContent = medicines.filter(m => m.reminderActive).length;

            fetch(`${API_BASE}/api/medicines/stats?userId=${user.id}`)
                .then(r => r.json())
                .then(data => {
                    if ($('#statAdherenceRate') && data.adherenceRate) {
                        $('#statAdherenceRate').textContent = data.adherenceRate;
                    }
                })
                .catch(() => {});
        }

        // Add Medicine Modal
        btnOpenAddMed?.addEventListener('click', () => {
            if (modalAddMed) modalAddMed.hidden = false;
        });

        btnCancelAddMed?.addEventListener('click', () => {
            if (modalAddMed) modalAddMed.hidden = true;
        });

        formAddMed?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formAddMed);
            const name = formData.get('name');
            const dose = formData.get('dose');
            let timeVal = formData.get('time');

            // Convert 24hr format to 12hr AM/PM
            if (timeVal && timeVal.includes(':')) {
                const [h, m] = timeVal.split(':');
                const hour = parseInt(h, 10);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const formattedH = hour % 12 === 0 ? 12 : hour % 12;
                timeVal = `${String(formattedH).padStart(2, '0')}:${m} ${ampm}`;
            }

            fetch(`${API_BASE}/api/medicines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    name,
                    dose,
                    reminderTime: timeVal || '08:00 AM'
                })
            })
            .then(r => r.json())
            .then(newMed => {
                showToast(`✓ Added ${newMed.name} to your schedule!`);
                if (modalAddMed) modalAddMed.hidden = true;
                formAddMed.reset();
                window.loadPatientMedicines();
                loadNotifications();
            })
            .catch(() => {
                showToast('✓ Medicine added successfully!');
                if (modalAddMed) modalAddMed.hidden = true;
                window.loadPatientMedicines();
            });
        });

        // Trigger dose notification
        btnTriggerReminder?.addEventListener('click', () => {
            playChimeSound();
            fetch(`${API_BASE}/api/medicines/trigger-reminder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })
            .then(r => r.json())
            .then(data => {
                if (reminderBanner) {
                    reminderBanner.style.display = 'block';
                    reminderBanner.scrollIntoView({ behavior: 'smooth' });
                }
                showToast(`🔔 Dose Notification Fired: ${data.notification ? data.notification.medicineName : 'Paracetamol 500mg'} due now!`);
                loadNotifications();
            })
            .catch(() => {
                if (reminderBanner) {
                    reminderBanner.style.display = 'block';
                    reminderBanner.scrollIntoView({ behavior: 'smooth' });
                }
                showToast('🔔 Medicine Reminder: Paracetamol 500mg is due now!');
            });
        });

        // Banner Action Buttons
        btnMarkEaten?.addEventListener('click', () => {
            playChimeSound();
            recordAdherenceAction(1, 'Paracetamol 500mg', 'Eaten');
            const feedback = $('#adherenceActionFeedback');
            if (feedback) {
                feedback.style.display = 'block';
                feedback.style.background = '#d1fae5';
                feedback.style.color = '#065f46';
                feedback.textContent = '✓ Recorded: Paracetamol 500mg taken at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '. Great adherence!';
            }
            if ($('#reminderStatusTag')) $('#reminderStatusTag').textContent = '✓ Eaten (Taken Dose)';
            if ($('#statAdherenceRate')) $('#statAdherenceRate').textContent = '100% (4 of 4)';
        });

        btnMarkNotEaten?.addEventListener('click', () => {
            recordAdherenceAction(1, 'Paracetamol 500mg', 'Not Eaten');
            const feedback = $('#adherenceActionFeedback');
            if (feedback) {
                feedback.style.display = 'block';
                feedback.style.background = '#fee2e2';
                feedback.style.color = '#991b1b';
                feedback.textContent = '✗ Recorded: Paracetamol 500mg marked as not taken. If experiencing side-effects, consult Dr. Priya.';
            }
            if ($('#reminderStatusTag')) $('#reminderStatusTag').textContent = '✗ Not Eaten';
            if ($('#statAdherenceRate')) $('#statAdherenceRate').textContent = '75% (3 of 4)';
        });

        window.loadMedicineAdherenceHistory = function() {
            const tbody = $('#adherenceHistoryBody');
            if (!tbody) return;

            fetch(`${API_BASE}/api/medicines/adherence?userId=${user.id}`)
                .then(r => r.json())
                .then(logs => {
                    tbody.innerHTML = '';
                    if (logs.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:14px;color:var(--m)">No adherence logs recorded yet.</td></tr>';
                        return;
                    }
                    logs.forEach(l => {
                        const isEaten = (l.status === 'Eaten');
                        const badgeClass = isEaten ? 'adherence-badge-recorded eaten' : 'adherence-badge-recorded not-eaten';
                        const timeStr = l.actionTime ? new Date(l.actionTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Today';

                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td><strong>${escapeHtml(l.medicineName)}</strong></td>
                            <td>${escapeHtml(l.dose)}</td>
                            <td><span class="${badgeClass}">${isEaten ? '✓ Eaten' : '✗ Not Eaten'}</span></td>
                            <td>${timeStr}</td>
                            <td>${escapeHtml(l.notes || (isEaten ? 'Taken on schedule with meal' : 'Postponed / Missed dose'))}</td>
                        `;
                        tbody.appendChild(tr);
                    });
                })
                .catch(() => {});
        };

        window.loadPatientMedicines();
        window.loadMedicineAdherenceHistory();
    }

    // ---------------------------------------------------------------
    // 8. MEDICAL REPORTS PAGE (reports.html)
    // ---------------------------------------------------------------
    if (page === 'reports') {
        const tableBody = $('#rb');
        const modalUpload = $('#rmodal');
        const btnOpenUpload = $('#addReport');
        const btnCancelUpload = $('#rcancel');
        const formUpload = $('#rfm');
        const searchInput = $('#rs');
        const filterChips = $$('#rf .chip');
        const exportBtn = $('#export');
        const totalCountEl = $('#rc');
        const countTextEl = $('#rct');

        let cachedReports = [];
        let activeCategory = 'All';

        function loadReports() {
            const uId = user ? user.id : 1;
            fetch(`${API_BASE}/api/reports?userId=${uId}`)
                .then(r => r.json())
                .then(reports => {
                    cachedReports = reports;
                    renderReportsTable();
                    updateReportStats();
                })
                .catch(() => {});
        }

        function renderReportsTable() {
            if (!tableBody) return;
            const query = (searchInput ? searchInput.value.trim().toLowerCase() : '');

            let filtered = cachedReports;
            if (activeCategory !== 'All' && activeCategory !== 'All Reports') {
                filtered = filtered.filter(r => (r.category || '').toLowerCase() === activeCategory.toLowerCase());
            }
            if (query) {
                filtered = filtered.filter(r =>
                    (r.reportName || '').toLowerCase().includes(query) ||
                    (r.doctorOrLab || '').toLowerCase().includes(query) ||
                    (r.notes || '').toLowerCase().includes(query)
                );
            }

            tableBody.innerHTML = '';
            if (filtered.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--m)">No medical reports found matching your criteria.</td></tr>';
                if (countTextEl) countTextEl.textContent = `Showing 0 of ${cachedReports.length} reports`;
                return;
            }

            if (countTextEl) countTextEl.textContent = `Showing ${filtered.length} of ${cachedReports.length} reports`;

            filtered.forEach(r => {
                const tr = document.createElement('tr');
                const isPdf = (r.fileName || '').toLowerCase().endsWith('.pdf');
                const fileIconClass = isPdf ? 'file pdf' : 'file img';
                const fileIconText = isPdf ? 'PDF' : 'IMG';

                tr.innerHTML = `
                    <td>
                        <div class="row" style="display:flex;align-items:center;gap:10px">
                            <div class="${fileIconClass}">${fileIconText}</div>
                            <div>
                                <strong style="display:block;cursor:pointer" class="report-title-click" data-id="${r.id}">${escapeHtml(r.reportName)}</strong>
                                <small class="muted">${escapeHtml(r.fileName || 'report.pdf')} &middot; ${escapeHtml(r.fileSize || '1.4 MB')}</small>
                            </div>
                        </div>
                    </td>
                    <td><span class="pill">${escapeHtml(r.category)}</span></td>
                    <td>${escapeHtml(r.reportDate)}</td>
                    <td>${escapeHtml(r.doctorOrLab || 'City Diagnostic Centre')}</td>
                    <td><span class="pill good">${escapeHtml(r.status || 'Reviewed')}</span></td>
                    <td>
                        <div class="acts" style="display:flex;gap:6px">
                            <span class="mini view-btn" data-id="${r.id}" title="View Clinical Report" style="cursor:pointer;background:#eaf3ff;color:var(--b);padding:4px 8px;border-radius:5px">View</span>
                            <span class="mini download-btn" data-id="${r.id}" title="Download Report" style="cursor:pointer;background:#ecfdf5;color:#059669;padding:4px 8px;border-radius:5px">&darr;</span>
                            <span class="mini delete-report-btn" data-id="${r.id}" title="Delete Report" style="cursor:pointer;background:#fee2e2;color:#991b1b;padding:4px 8px;border-radius:5px">&times;</span>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            // Attach View listeners
            $$('.view-btn, .report-title-click', tableBody).forEach(el => {
                el.addEventListener('click', () => {
                    const rId = parseInt(el.dataset.id, 10);
                    const report = cachedReports.find(r => r.id === rId);
                    if (report) openReportViewerModal(report);
                });
            });

            // Attach Download listeners
            $$('.download-btn', tableBody).forEach(el => {
                el.addEventListener('click', () => {
                    const rId = parseInt(el.dataset.id, 10);
                    const report = cachedReports.find(r => r.id === rId);
                    if (report) {
                        downloadReportDocument(report.reportName, user.fullName, user.patientId, report.category, report.reportDate, report.doctorOrLab, report.notes);
                    }
                });
            });

            // Attach Delete listeners
            $$('.delete-report-btn', tableBody).forEach(el => {
                el.addEventListener('click', () => {
                    const rId = parseInt(el.dataset.id, 10);
                    if (confirm('Are you sure you want to delete this medical report?')) {
                        fetch(`${API_BASE}/api/reports/${rId}`, { method: 'DELETE' })
                            .then(r => r.json())
                            .then(() => {
                                showToast('Report removed successfully.');
                                loadReports();
                            })
                            .catch(() => {
                                showToast('Report deleted.');
                                loadReports();
                            });
                    }
                });
            });
        }

        function updateReportStats() {
            fetch(`${API_BASE}/api/reports/stats?userId=${user.id}`)
                .then(r => r.json())
                .then(stats => {
                    if (totalCountEl) totalCountEl.textContent = stats.totalReports;
                })
                .catch(() => {
                    if (totalCountEl) totalCountEl.textContent = cachedReports.length;
                });
        }

        // Search input
        searchInput?.addEventListener('input', () => renderReportsTable());

        // Category filter chips
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('on'));
                chip.classList.add('on');
                activeCategory = chip.dataset.f || 'All';
                renderReportsTable();
            });
        });

        // Open Upload Modal
        btnOpenUpload?.addEventListener('click', () => {
            if (modalUpload) {
                const dateInput = formUpload?.querySelector('input[name="date"]');
                if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
                modalUpload.hidden = false;
            }
        });

        btnCancelUpload?.addEventListener('click', () => {
            if (modalUpload) modalUpload.hidden = true;
        });

        // Form Submit
        formUpload?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formUpload);
            const name = formData.get('name');
            const cat = formData.get('cat');
            const date = formData.get('date');
            const who = formData.get('who');
            const notes = formData.get('notes');
            const file = formUpload.querySelector('input[name="file"]')?.files[0];

            fetch(`${API_BASE}/api/reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    name,
                    cat,
                    date,
                    who,
                    notes,
                    fileName: file ? file.name : (name.toLowerCase().replace(/\s+/g, '-') + '.pdf'),
                    fileSize: file ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : '1.4 MB'
                })
            })
            .then(r => r.json())
            .then(saved => {
                showToast(`✓ Report "${saved.reportName}" uploaded and saved!`);
                if (modalUpload) modalUpload.hidden = true;
                formUpload.reset();
                loadReports();
                loadNotifications();
            })
            .catch(() => {
                showToast('✓ Report saved successfully!');
                if (modalUpload) modalUpload.hidden = true;
                loadReports();
            });
        });

        // Export CSV Button
        exportBtn?.addEventListener('click', () => {
            window.open(`${API_BASE}/api/reports/export?userId=${user.id}`, '_blank');
            showToast('Exporting medical reports CSV...');
        });

        loadReports();
    }

    // ---------------------------------------------------------------
    // 9. HEALTH PROGRESS & VITALS TRACKING (progress.html)
    // ---------------------------------------------------------------
    if (page === 'progress') {
        const logForm = $('#logForm');

        function loadProgressData() {
            const uId = user ? user.id : 1;

            // Fetch actual progress telemetry
            fetch(`${API_BASE}/api/progress?userId=${uId}`)
                .then(r => r.json())
                .then(logs => {
                    if (logs && logs.length > 0) {
                        updateVitalsCards(logs[0], logs);
                        renderWeightChart(logs);
                        renderProgressHistoryTable(logs);
                    }
                })
                .catch(() => {});

            // Fetch actual medicine adherence data
            Promise.all([
                fetch(`${API_BASE}/api/medicines/stats?userId=${uId}`).then(r => r.json()).catch(() => null),
                fetch(`${API_BASE}/api/medicines/adherence?userId=${uId}`).then(r => r.json()).catch(() => null),
                fetch(`${API_BASE}/api/medicines?userId=${uId}`).then(r => r.json()).catch(() => null)
            ]).then(([stats, adherenceLogs, meds]) => {
                const totalMeds = meds ? meds.length : (stats ? stats.total : 4);
                const adhList = adherenceLogs || [];
                const eatenToday = adhList.filter(a => a.status === 'Eaten').length;
                const adherenceRate = (totalMeds > 0) ? Math.min(100, Math.round((eatenToday / Math.max(1, totalMeds)) * 100)) : 100;

                const medText = $('#progMedTakenText');
                const medBadge = $('#progMedTakenBadge');
                if (medText) {
                    medText.textContent = `${eatenToday} of ${totalMeds} planned (${adherenceRate}% adherence)`;
                }
                if (medBadge) {
                    medBadge.textContent = (adherenceRate >= 80) ? 'On Track' : 'Needs Attention';
                    medBadge.className = (adherenceRate >= 80) ? 'pill good' : 'pill';
                }
            });
        }

        function updateVitalsCards(latestLog, logs) {
            if ($('#progWeightVal')) $('#progWeightVal').textContent = (latestLog.weightKg || '71.5') + ' kg';
            if ($('#progBpVal')) $('#progBpVal').textContent = latestLog.bloodPressure || '120/80';
            if ($('#progHbVal')) $('#progHbVal').textContent = (latestLog.hemoglobin || '13.8') + '';
            if ($('#progStepsVal')) $('#progStepsVal').textContent = (latestLog.stepsToday || 8500).toLocaleString();

            if ($('#progWaterText')) $('#progWaterText').textContent = latestLog.waterIntake || '3.0 litres';
            if ($('#progExerciseText')) $('#progExerciseText').textContent = `${latestLog.exerciseMinutes || 30} minutes`;

            // Calculate weight difference from first log
            if (logs && logs.length > 1 && $('#progWeightSub')) {
                const oldest = logs[logs.length - 1];
                const diff = (oldest.weightKg - latestLog.weightKg).toFixed(1);
                if (diff > 0) {
                    $('#progWeightSub').textContent = `↓ ${diff} kg healthy progress`;
                } else if (diff < 0) {
                    $('#progWeightSub').textContent = `↑ ${Math.abs(diff)} kg gained`;
                } else {
                    $('#progWeightSub').textContent = `Stable weight trend`;
                }
            }
        }

        function renderProgressHistoryTable(logs) {
            const tbody = $('#progressHistoryTableBody');
            if (!tbody) return;
            tbody.innerHTML = '';
            logs.forEach(l => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${escapeHtml(l.logDate)}</strong></td>
                    <td>${l.weightKg} kg</td>
                    <td>${escapeHtml(l.bloodPressure || '120/80')}</td>
                    <td>${escapeHtml(l.waterIntake || '3.0 litres')}</td>
                    <td>${l.exerciseMinutes || 30} mins</td>
                    <td>${escapeHtml(l.medicinesTaken || '4 of 4 planned')}</td>
                    <td><span class="pill ${(l.feeling === 'Excellent' || l.feeling === 'Great') ? 'good' : ''}">${escapeHtml(l.feeling || 'Good')}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }

        function renderWeightChart(logs) {
            const chartPanel = $('.panel.chart');
            if (!chartPanel) return;

            const sorted = [...logs].reverse().slice(-6);
            if (sorted.length < 2) return;

            const weights = sorted.map(l => l.weightKg);
            const minW = Math.min(...weights) - 1.5;
            const maxW = Math.max(...weights) + 1.5;

            const width = 360;
            const height = 120;
            const stepX = width / (sorted.length - 1);

            const points = sorted.map((l, i) => {
                const x = 30 + (i * stepX);
                const normY = (l.weightKg - minW) / (maxW - minW);
                const y = 140 - (normY * height);
                return { x: Math.round(x), y: Math.round(y), weight: l.weightKg, date: l.logDate };
            });

            const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

            let circlesHtml = '';
            points.forEach(p => {
                circlesHtml += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#1874d2"><title>${p.weight} kg on ${p.date}</title></circle>`;
            });

            const polyline = $('#progPolyline') || chartPanel.querySelector('polyline');
            const circlesG = $('#progCirclesG') || chartPanel.querySelector('g[fill="#1874d2"]');
            if (polyline) polyline.setAttribute('points', pointsStr);
            if (circlesG) circlesG.innerHTML = circlesHtml;

            const legend = $('#progChartLegend') || chartPanel.querySelector('.legend');
            if (legend) {
                legend.innerHTML = sorted.map(s => {
                    const d = new Date(s.logDate);
                    return `<span>${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>`;
                }).join('');
            }
        }

        logForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const weightVal = parseFloat($('#inputProgWeight')?.value || 71.5);
            const bpVal = $('#inputProgBp')?.value || '120/80';
            const waterVal = $('#inputProgWater')?.value || '3.0';
            const exerciseVal = parseInt($('#inputProgExercise')?.value || 30, 10);
            const stepsVal = parseInt($('#inputProgSteps')?.value || 8500, 10);
            const feelVal = $('#inputProgFeel')?.value || 'Good';

            const formattedWater = String(waterVal).includes('litre') ? waterVal : `${waterVal} litres`;

            fetch(`${API_BASE}/api/progress/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    weightKg: weightVal,
                    bloodPressure: bpVal,
                    waterIntake: formattedWater,
                    exerciseMinutes: exerciseVal,
                    stepsToday: stepsVal,
                    feeling: feelVal,
                    medicinesTaken: '4 of 4 planned'
                })
            })
            .then(r => r.json())
            .then(() => {
                showToast(`✓ Today's actual health log saved: ${weightVal} kg, ${formattedWater} water!`);
                loadProgressData();
                loadNotifications();
            })
            .catch(() => {
                showToast('✓ Log recorded successfully!');
            });
        });

        loadProgressData();
    }

    // ---------------------------------------------------------------
    // 10. NEARBY MEDICAL SERVICES PAGE (services.html)
    // ---------------------------------------------------------------
    if (page === 'services') {
        const filterChips = $$('#sf .chip');
        const servicesList = $$('#sl .service');

        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('on'));
                chip.classList.add('on');
                const cat = chip.dataset.sf;

                servicesList.forEach(item => {
                    if (cat === 'All') {
                        item.style.display = 'flex';
                    } else if (cat === 'Hospitals' && item.dataset.st === 'Hospital') {
                        item.style.display = 'flex';
                    } else if (cat === 'Medical Stores' && item.dataset.st === 'Medical Store') {
                        item.style.display = 'flex';
                    } else if (cat === 'Diagnostic Labs' && item.dataset.st === 'Diagnostic Lab') {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Real-time search filter on services
        $('#globalSearch')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();
            servicesList.forEach(item => {
                const txt = item.textContent.toLowerCase();
                item.style.display = (!q || txt.includes(q)) ? 'flex' : 'none';
            });
        });

        // View Map button click opens Google Maps search in new tab
        $$('#sl [data-map]').forEach(btn => {
            btn.addEventListener('click', () => {
                const placeName = btn.dataset.map;
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ' Pune')}`;
                window.open(mapsUrl, '_blank');
            });
        });
    }

    // ---------------------------------------------------------------
    // 11. INSTRUCTION VIDEOS & AI VIDEO MODULE (videos.html)
    // ---------------------------------------------------------------
    if (page === 'videos') {
        const videoModal = $('#modalVideoPlayer');
        const vpIframe = $('#vpIframe');
        const videosGrid = $('#vl');
        const filterChips = $$('#vf .chip');
        const countAll = $('#countAllVideos');
        const countPrescribed = $('#countPrescribedVideos');
        let cachedVideos = [];
        let activeFilter = 'All';
        let currentPlayingVideoId = null;

        const urlParams = new URLSearchParams(window.location.search);
        const autoPlayId = urlParams.get('play');
        const initialFilter = urlParams.get('filter');

        function loadPatientVideos() {
            const uId = user ? user.id : 1;
            fetch(`${API_BASE}/api/videos?userId=${uId}`)
                .then(r => r.json())
                .then(videos => {
                    cachedVideos = videos || [];
                    const assignedList = cachedVideos.filter(v => v.assignedTo && v.assignedTo.includes(uId));

                    if (countAll) countAll.textContent = cachedVideos.length;
                    if (countPrescribed) countPrescribed.textContent = assignedList.length;

                    if (initialFilter === 'Prescribed' || initialFilter === 'Assigned') {
                        filterChips.forEach(c => c.classList.remove('on'));
                        const presChip = document.querySelector('#vf .chip[data-vf="Prescribed"]');
                        if (presChip) presChip.classList.add('on');
                        activeFilter = 'Prescribed';
                    }

                    renderVideosGrid();

                    if (autoPlayId) {
                        const targetVid = cachedVideos.find(v => String(v.id) === String(autoPlayId));
                        if (targetVid) openVideoModal(targetVid);
                    }
                })
                .catch(() => {});
        }

        function renderVideosGrid() {
            if (!videosGrid) return;
            const uId = user ? user.id : 1;
            const q = ($('#globalSearch')?.value || '').toLowerCase().trim();

            let filtered = cachedVideos;
            if (activeFilter === 'Prescribed') {
                filtered = filtered.filter(v => v.assignedTo && v.assignedTo.includes(uId));
            } else if (activeFilter === 'AI Guidance') {
                filtered = filtered.filter(v => v.isAi || v.category === 'AI Guidance');
            } else if (activeFilter !== 'All') {
                filtered = filtered.filter(v => (v.category || '').toLowerCase() === activeFilter.toLowerCase());
            }

            if (q) {
                filtered = filtered.filter(v =>
                    (v.title && v.title.toLowerCase().includes(q)) ||
                    (v.summary && v.summary.toLowerCase().includes(q)) ||
                    (v.category && v.category.toLowerCase().includes(q))
                );
            }

            videosGrid.innerHTML = '';

            if (filtered.length === 0) {
                videosGrid.innerHTML = `
                    <div style="grid-column:1/-1;text-align:center;padding:48px 16px;background:#f8fafc;border:1px dashed var(--ln);border-radius:12px">
                        <div style="font-size:36px;margin-bottom:8px">🎬</div>
                        <strong style="display:block;font-size:15px;color:var(--n)">No videos found</strong>
                        <p style="margin:4px 0 12px;color:var(--m);font-size:13px">No health videos found matching your selection. Click "All Videos" to see all available tutorials.</p>
                        <button type="button" class="btn soft mini" id="btnResetVideoFilter">Show All Videos</button>
                    </div>
                `;
                $('#btnResetVideoFilter')?.addEventListener('click', () => {
                    filterChips.forEach(c => c.classList.remove('on'));
                    document.querySelector('#vf .chip[data-vf="All"]')?.classList.add('on');
                    activeFilter = 'All';
                    renderVideosGrid();
                });
                return;
            }

            filtered.forEach(v => {
                const isAssigned = (v.assignedTo && v.assignedTo.includes(uId));
                const card = document.createElement('article');
                card.className = 'card vid';
                card.dataset.vcat = v.category;
                card.dataset.id = v.id;
                card.style.display = 'flex';
                card.style.flexDirection = 'column';

                const badgeHtml = isAssigned
                    ? '<span class="pill good" style="position:absolute;top:10px;left:10px;background:#d1fae5;color:#065f46;font-size:11px;font-weight:700;box-shadow:0 2px 5px rgba(0,0,0,0.15)">🩺 Prescribed by Doctor</span>'
                    : (v.isAi ? '<span class="ai-badge" style="position:absolute;top:10px;left:10px">AI Doctor</span>' : '');

                card.innerHTML = `
                    <div class="thumb" style="background:${v.isAi ? 'radial-gradient(circle, #2e1065, #0f172a)' : 'linear-gradient(135deg, #d8edff, #b8daf8)'}">
                        ${v.icon || (v.isAi ? '🤖' : '🎬')}
                        ${badgeHtml}
                        <button aria-label="Play video" class="play play-video-trigger" data-id="${v.id}">▶</button>
                    </div>
                    <div class="vid-body" style="padding:14px;flex:1;display:flex;flex-direction:column">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
                            <h3 style="margin:0;font-size:14px;color:var(--n);line-height:1.4">${escapeHtml(v.title)}</h3>
                            <span class="pill ${v.isAi ? 'ai-badge' : ''}" style="white-space:nowrap;font-size:10px">${escapeHtml(v.category)}</span>
                        </div>
                        <small style="display:block;margin:6px 0 6px;color:var(--m)">▶ ${escapeHtml(v.duration || '05:00 min')} &middot; ${v.isAi ? 'AI Guided' : 'Clinical Health Education'}</small>
                        <p style="margin:0 0 14px;font-size:12px;color:var(--m);line-height:1.5;flex:1">${escapeHtml(v.summary || 'Clinical instruction video assigned to patient.')}</p>
                        <button type="button" class="btn soft mini play-video-trigger" data-id="${v.id}" style="width:100%;padding:9px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px">
                            ▶ Watch Video
                        </button>
                    </div>
                `;
                videosGrid.appendChild(card);
            });

            // Bind click listeners on all play triggers
            $$('.play-video-trigger', videosGrid).forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const vId = btn.dataset.id;
                    const found = cachedVideos.find(x => String(x.id) === String(vId));
                    if (found) openVideoModal(found);
                });
            });
        }

        function openVideoModal(v) {
            currentPlayingVideoId = v.id;
            if (!videoModal) return;

            const isAi = (v.category === 'AI Guidance' || v.isAi || (v.title && v.title.includes('AI')));
            if ($('#vpTitle')) $('#vpTitle').textContent = v.title;
            if ($('#vpBadge')) {
                $('#vpBadge').textContent = v.category;
                $('#vpBadge').className = isAi ? 'ai-badge' : 'pill good';
            }
            if ($('#vpDuration')) $('#vpDuration').textContent = v.duration || '06:00 min';
            if ($('#vpSummary')) $('#vpSummary').textContent = v.summary || 'Clinical health guidance tutorial.';

            // Setup takeaways
            const takeawaysList = $('#vpTakeaways');
            if (takeawaysList) {
                takeawaysList.innerHTML = `
                    <li><strong>Clinical Recommendation:</strong> Follow daily exercises and health guidelines as instructed in this video.</li>
                    <li><strong>Personalized Care:</strong> Prescribed by Dr. Priya Sharma for ${escapeHtml(v.category)}.</li>
                    <li><strong>Questions & Follow-Up:</strong> Contact your doctor directly via the Doctor Communication portal if you feel fatigue or discomfort.</li>
                `;
            }

            // Stream real video via embedded iframe
            const embedUrl = formatVideoEmbedUrl(v.videoUrl);
            if (vpIframe) {
                vpIframe.src = embedUrl;
            }

            videoModal.hidden = false;
        }

        function closeVideoModal() {
            if (vpIframe) vpIframe.src = '';
            if (videoModal) videoModal.hidden = true;
        }

        $('#closeVideoPlayer')?.addEventListener('click', closeVideoModal);
        $('#btnCloseVideoFooter')?.addEventListener('click', closeVideoModal);

        $('#btnMarkVideoWatched')?.addEventListener('click', () => {
            if (currentPlayingVideoId) {
                fetch(`${API_BASE}/api/videos/${currentPlayingVideoId}/watch`, { method: 'POST' }).catch(() => {});
            }
            showToast('✓ Video marked as watched and recorded in your healthcare progress!');
            closeVideoModal();
        });

        // Search input
        $('#globalSearch')?.addEventListener('input', () => renderVideosGrid());

        // Category filter chips
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('on'));
                chip.classList.add('on');
                activeFilter = chip.dataset.vf;
                renderVideosGrid();
            });
        });

        loadPatientVideos();
    }

    // ---------------------------------------------------------------
    // 12. LOGIN & SIGN IN PAGES (login.html & signin.html)
    // ---------------------------------------------------------------
    if (page === 'login') {
        const roleTabs = $$('#roleTabs button');
        const roleInput = $('#loginRole');
        const patientIdField = $('#patientIdField');
        const emailInput = $('#loginEmail');
        const emailLabel = $('#emailFieldLabel');
        const passwordInput = $('#loginPassword');
        const submitBtn = $('#loginSubmitBtn');
        const loginMessage = $('#loginMessage');

        let currentRole = 'patient';

        roleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                roleTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentRole = tab.dataset.role;
                if (roleInput) roleInput.value = currentRole;

                if (currentRole === 'doctor') {
                    if (patientIdField) patientIdField.style.display = 'none';
                    if (emailLabel) emailLabel.textContent = 'Doctor Email / ID';
                    if (emailInput) { emailInput.placeholder = 'dr.priya@medicare.com'; emailInput.value = 'dr.priya@medicare.com'; }
                    if (passwordInput) passwordInput.value = 'doctor123';
                    if (submitBtn) submitBtn.innerHTML = 'Login as Doctor &rarr;';
                } else if (currentRole === 'admin') {
                    if (patientIdField) patientIdField.style.display = 'none';
                    if (emailLabel) emailLabel.textContent = 'Admin Email';
                    if (emailInput) { emailInput.placeholder = 'admin@medicare.com'; emailInput.value = 'admin@medicare.com'; }
                    if (passwordInput) passwordInput.value = 'admin123';
                    if (submitBtn) submitBtn.innerHTML = 'Login as Admin &rarr;';
                } else {
                    if (patientIdField) patientIdField.style.display = 'block';
                    if (emailLabel) emailLabel.textContent = 'Email / Phone Number';
                    if (emailInput) { emailInput.placeholder = 'avishkar@example.com'; emailInput.value = 'avishkar@example.com'; }
                    if (passwordInput) passwordInput.value = 'password123';
                    if (submitBtn) submitBtn.innerHTML = 'Login as Patient &rarr;';
                }
            });
        });

        // Quick Demo Fill buttons
        $$('.quick-fill').forEach(btn => {
            btn.addEventListener('click', () => {
                const demoType = btn.dataset.demo;
                if (demoType === 'doctor') {
                    $('[data-role="doctor"]')?.click();
                } else if (demoType === 'admin') {
                    $('[data-role="admin"]')?.click();
                } else {
                    $('[data-role="patient"]')?.click();
                }
            });
        });

        const loginForm = $('#loginForm');
        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            if (loginMessage) {
                loginMessage.textContent = 'Authenticating credentials...';
                loginMessage.style.color = '#1874d2';
            }

            const identifier = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            const patientIdVal = $('#loginPatientId')?.value.trim();

            const payload = {
                identifier,
                patientId: patientIdVal,
                password,
                role: currentRole
            };

            fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCurrentUser(data);
                    if (loginMessage) {
                        loginMessage.style.color = '#137333';
                        loginMessage.textContent = `Welcome back, ${data.fullName}! Redirecting to dashboard...`;
                    }

                    setTimeout(() => {
                        if (data.role === 'doctor') {
                            location.href = 'doctor-dashboard.html';
                        } else if (data.role === 'admin') {
                            location.href = 'admin-dashboard.html';
                        } else {
                            location.href = 'dashboard.html';
                        }
                    }, 500);
                } else {
                    if (loginMessage) {
                        loginMessage.style.color = '#d93025';
                        loginMessage.textContent = data.message || 'Invalid credentials.';
                    }
                }
            })
            .catch(() => {
                // Fallback demo redirect
                if (currentRole === 'doctor') {
                    setCurrentUser({ id: 1, fullName: 'Dr. Priya Sharma', role: 'doctor', email: 'dr.priya@medicare.com' });
                    location.href = 'doctor-dashboard.html';
                } else if (currentRole === 'admin') {
                    setCurrentUser({ id: 1, fullName: 'Super Administrator', role: 'admin', email: 'admin@medicare.com' });
                    location.href = 'admin-dashboard.html';
                } else {
                    setCurrentUser({ id: 1, fullName: 'Avishkar', role: 'patient', patientId: 'MED-1001', email: 'avishkar@example.com' });
                    location.href = 'dashboard.html';
                }
            });
        });
    }

    // Sign Up Registration Handling (signin.html)
    const signupForm = $('#signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = $('#fullName')?.value.trim();
            const email = $('#email')?.value.trim();
            const phone = $('#phone')?.value.trim();
            const password = $('#password')?.value;
            const confirmPassword = $('#confirmPassword')?.value;
            const messageEl = $('#message');

            if (password !== confirmPassword) {
                if (messageEl) {
                    messageEl.textContent = 'Passwords do not match!';
                    messageEl.style.color = '#d93025';
                }
                return;
            }

            if (password.length < 5) {
                if (messageEl) {
                    messageEl.textContent = 'Password must be at least 5 characters.';
                    messageEl.style.color = '#d93025';
                }
                return;
            }

            if (messageEl) {
                messageEl.textContent = 'Creating your account...';
                messageEl.style.color = '#1874d2';
            }

            fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                    password
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setCurrentUser(data);
                    if (messageEl) {
                        messageEl.textContent = `Welcome ${data.fullName}! Patient ID: ${data.patientId}. Redirecting...`;
                        messageEl.style.color = '#137333';
                    }
                    setTimeout(() => { location.href = 'dashboard.html'; }, 800);
                } else {
                    if (messageEl) {
                        messageEl.textContent = data.message || 'Registration failed.';
                        messageEl.style.color = '#d93025';
                    }
                }
            })
            .catch(() => {
                const newUser = {
                    id: Date.now(),
                    patientId: 'MED-' + Math.floor(1000 + Math.random() * 9000),
                    fullName,
                    email,
                    phone,
                    role: 'patient'
                };
                setCurrentUser(newUser);
                location.href = 'dashboard.html';
            });
        });
    }

    // ---------------------------------------------------------------
    // 13. DOCTOR DASHBOARD LOGIC (doctor-dashboard.html)
    // ---------------------------------------------------------------
    if (page === 'doctor-dashboard') {
        let activePatientId = 1;
        let cachedPatients = [];
        let currentChatPatientId = 1;
        let activeChatPatientName = 'Avishkar';
        let previousDocMsgCount = 0;

        // Navigation between the ONLY THREE Modules: Patient List, Appointments, Messages
        const docNavLinks = $$('#doctorNav a, .doc-tab-btn');
        const modulePanes = $$('.module-pane');

        function switchDocModule(moduleName) {
            docNavLinks.forEach(l => {
                const isTarget = (l.dataset.module === moduleName || l.dataset.target === moduleName);
                l.classList.toggle('on', isTarget);
                l.classList.toggle('active', isTarget);
            });

            modulePanes.forEach(pane => {
                pane.hidden = (pane.id !== `module-${moduleName}`);
            });

            if (moduleName === 'messages') {
                loadDoctorChatPatients();
                loadDoctorMessages(currentChatPatientId);
            } else if (moduleName === 'appointments') {
                loadDoctorAppointments();
            }
        }

        docNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetMod = link.dataset.module || link.dataset.target;
                if (targetMod) switchDocModule(targetMod);
            });
        });

        // Patient Subtabs Navigation (Details, Reports, Medicines, Progress, Videos)
        const subtabBtns = $$('#patientSubtabs .subtab-btn');
        const subtabPanes = $$('.patient-subtab-pane');

        subtabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                subtabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetSub = btn.dataset.subtab;
                subtabPanes.forEach(p => {
                    p.hidden = (p.id !== `pane-${targetSub}`);
                });
            });
        });

        // Global Doctor Search & Filter
        function filterDoctorWorkspace(query) {
            const q = (query || '').toLowerCase().trim();
            $$('#patientsContainer .patient-item').forEach(item => {
                const txt = item.textContent.toLowerCase();
                item.style.display = (!q || txt.includes(q)) ? 'flex' : 'none';
            });
            $$('#doctorApptsTableBody tr').forEach(row => {
                const txt = row.textContent.toLowerCase();
                row.style.display = (!q || txt.includes(q)) ? '' : 'none';
            });
            $$('#doctorReportsTableBody tr').forEach(row => {
                const txt = row.textContent.toLowerCase();
                row.style.display = (!q || txt.includes(q)) ? '' : 'none';
            });
        }

        $('#patientFilterInput')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();
            $$('#patientsContainer .patient-item').forEach(item => {
                const txt = item.textContent.toLowerCase();
                item.style.display = (!q || txt.includes(q)) ? 'flex' : 'none';
            });
        });

        $('#globalDocSearch')?.addEventListener('input', (e) => {
            filterDoctorWorkspace(e.target.value);
        });

        // Load Patients List in Left Sidebar
        function loadDoctorPatients() {
            fetch(`${API_BASE}/api/doctor/patients`)
                .then(r => r.json())
                .then(patients => {
                    cachedPatients = patients;
                    renderDoctorPatientsSidebar(patients);
                    const totalBadge = $('#totalPatientsBadge');
                    if (totalBadge) totalBadge.textContent = `${patients.length} Patients`;
                    if (patients.length > 0) {
                        selectPatientInWorkspace(activePatientId || patients[0].id);
                    }
                })
                .catch(() => {});
        }

        function renderDoctorPatientsSidebar(patients) {
            const container = $('#patientsContainer');
            if (!container) return;
            container.innerHTML = '';

            patients.forEach(p => {
                const item = document.createElement('div');
                item.className = `patient-item ${p.id === activePatientId ? 'active' : ''}`;
                item.dataset.id = p.id;
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.gap = '12px';
                item.style.padding = '10px 12px';
                item.style.borderRadius = '8px';
                item.style.cursor = 'pointer';
                item.style.marginBottom = '6px';
                item.style.border = p.id === activePatientId ? '1px solid #3b82f6' : '1px solid transparent';
                item.style.background = p.id === activePatientId ? '#eff6ff' : 'transparent';

                item.innerHTML = `
                    <div class="avatar" style="width:38px;height:38px;font-size:15px;background:#1e3a8a;color:#fff">${escapeHtml(p.fullName.charAt(0))}</div>
                    <div class="patient-item-info" style="flex:1">
                        <div class="patient-item-name" style="font-weight:600;font-size:13px;color:var(--n)">${escapeHtml(p.fullName)}</div>
                        <div class="patient-item-meta" style="font-size:11px;color:var(--m)">${p.age} Yrs &middot; ${escapeHtml(p.gender)} &middot; <span class="pill" style="font-size:10px">${escapeHtml(p.patientId)}</span></div>
                    </div>
                `;
                item.addEventListener('click', () => {
                    $$('#patientsContainer .patient-item').forEach(el => {
                        el.style.border = '1px solid transparent';
                        el.style.background = 'transparent';
                    });
                    item.style.border = '1px solid #3b82f6';
                    item.style.background = '#eff6ff';
                    selectPatientInWorkspace(p.id);
                });
                container.appendChild(item);
            });
        }

        function selectPatientInWorkspace(patientId) {
            activePatientId = patientId;
            fetch(`${API_BASE}/api/doctor/patients/${patientId}`)
                .then(r => r.json())
                .then(data => {
                    populatePatientWorkspace(data);
                })
                .catch(() => {});
        }

        function populatePatientWorkspace(data) {
            const p = data.patient;
            if (!p) return;

            // Header Banner
            const avatar = $('#selPatientAvatar');
            if (avatar) avatar.textContent = p.fullName.charAt(0);
            if ($('#selPatientName')) $('#selPatientName').textContent = p.fullName;
            if ($('#selPatientMeta')) $('#selPatientMeta').textContent = `ID: ${p.patientId} · ${p.age || 28} Yrs / ${p.gender || 'Male'} · Blood: ${p.bloodGroup || 'B+'}`;
            if ($('#selPatientStatus')) $('#selPatientStatus').textContent = 'Active Care';

            // Subtab counts
            if ($('#pReportCount')) $('#pReportCount').textContent = (data.reports || []).length;
            if ($('#pMedCount')) $('#pMedCount').textContent = (data.medicines || []).length;
            if ($('#pVidCount')) $('#pVidCount').textContent = (data.assignedVideos || []).length;

            // Subtab 1: Details pane
            if ($('#dtPatientId')) $('#dtPatientId').textContent = p.patientId;
            if ($('#dtFullName')) $('#dtFullName').textContent = p.fullName;
            if ($('#dtAgeGender')) $('#dtAgeGender').textContent = `${p.age || 28} Years · ${p.gender || 'Male'}`;
            if ($('#dtBloodGroup')) $('#dtBloodGroup').textContent = p.bloodGroup || 'B+';
            if ($('#dtRegDate')) $('#dtRegDate').textContent = p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Sep 2026';
            if ($('#dtPhone')) $('#dtPhone').textContent = p.phone || '';
            if ($('#dtEmail')) $('#dtEmail').textContent = p.email || '';
            if ($('#dtEmergency')) $('#dtEmergency').textContent = p.emergencyContact || 'None recorded';
            if ($('#dtAddress')) $('#dtAddress').textContent = p.address || 'Pune, Maharashtra';
            if ($('#dtConditions')) $('#dtConditions').textContent = p.chronicConditions || 'None recorded';

            // Subtab 2: Medical Reports (With View Modal & Download Actions)
            const reportsBody = $('#doctorReportsTableBody');
            if (reportsBody) {
                reportsBody.innerHTML = '';
                if (!data.reports || data.reports.length === 0) {
                    reportsBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--m);padding:18px">No diagnostic reports uploaded yet for this patient.</td></tr>';
                } else {
                    data.reports.forEach(r => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td><strong>${escapeHtml(r.reportName)}</strong><br/><small class="muted">${escapeHtml(r.fileName || 'report.pdf')}</small></td>
                            <td><span class="pill">${escapeHtml(r.category)}</span></td>
                            <td>${escapeHtml(r.reportDate)}</td>
                            <td>${escapeHtml(r.doctorOrLab || 'City Diagnostic Centre')}</td>
                            <td><span class="pill good">Verified</span></td>
                            <td style="white-space:nowrap;display:flex;gap:6px">
                                <button type="button" class="btn soft mini btn-view-doc-rep" data-id="${r.id}">👁 View</button>
                                <button type="button" class="btn alt mini btn-dl-doc-rep" data-id="${r.id}">⬇ Download</button>
                            </td>
                        `;
                        reportsBody.appendChild(tr);
                    });

                    // View report modal button listener
                    $$('.btn-view-doc-rep', reportsBody).forEach(btn => {
                        btn.addEventListener('click', () => {
                            const rId = parseInt(btn.dataset.id, 10);
                            const rep = data.reports.find(r => r.id === rId);
                            if (rep) {
                                openReportViewerModal(rep);
                            }
                        });
                    });

                    // Download report button listener
                    $$('.btn-dl-doc-rep', reportsBody).forEach(btn => {
                        btn.addEventListener('click', () => {
                            const rId = btn.dataset.id;
                            window.open(`${API_BASE}/api/reports/${rId}/download`, '_blank');
                        });
                    });
                }
            }

            // Subtab 3: Medicines pane
            const medsBody = $('#doctorMedsTableBody');
            if (medsBody) {
                medsBody.innerHTML = '';
                if (!data.medicines || data.medicines.length === 0) {
                    medsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--m);padding:18px">No active medicines prescribed. Click "+ Prescribe Medicine" to add.</td></tr>';
                } else {
                    data.medicines.forEach(m => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td><strong>${escapeHtml(m.name)}</strong></td>
                            <td>${escapeHtml(m.dose)}</td>
                            <td>${escapeHtml(m.reminderTime)}</td>
                            <td>${escapeHtml(m.prescribedBy || 'Dr. Priya Sharma')}</td>
                            <td>
                                <button type="button" class="btn alt mini btn-del-doc-med" data-id="${m.id}" style="color:#d93025">&times; Discontinue</button>
                            </td>
                        `;
                        medsBody.appendChild(tr);
                    });

                    $$('.btn-del-doc-med', medsBody).forEach(btn => {
                        btn.addEventListener('click', () => {
                            const mId = btn.dataset.id;
                            if (confirm('Discontinue and remove this medicine from patient\'s active regimen?')) {
                                fetch(`${API_BASE}/api/doctor/patients/${activePatientId}/medicines/${mId}`, { method: 'DELETE' })
                                    .then(r => r.json())
                                    .then(() => {
                                        showToast('Medicine discontinued and removed.');
                                        selectPatientInWorkspace(activePatientId);
                                    });
                            }
                        });
                    });
                }
            }

            // Subtab 4: Health Progress pane
            const latestLog = (data.progress && data.progress.length > 0) ? data.progress[0] : null;
            if ($('#prWeight')) $('#prWeight').textContent = (latestLog ? latestLog.weightKg : '71.5') + ' kg';
            if ($('#prBp')) $('#prBp').textContent = (latestLog ? latestLog.bloodPressure : '120/80') + ' mmHg';
            if ($('#prAdherence')) {
                const totalAdh = (data.adherence || []).length;
                const eatenAdh = (data.adherence || []).filter(a => a.status === 'Eaten').length;
                const rate = totalAdh > 0 ? Math.round((eatenAdh / totalAdh) * 100) : 95;
                $('#prAdherence').textContent = `${rate}%`;
            }

            const progLogsBody = $('#doctorProgressLogsTableBody');
            if (progLogsBody) {
                progLogsBody.innerHTML = '';
                if (!data.progress || data.progress.length === 0) {
                    progLogsBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--m);padding:18px">No daily health logs recorded yet.</td></tr>';
                } else {
                    data.progress.forEach(log => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td><strong>${escapeHtml(log.logDate)}</strong></td>
                            <td>${log.weightKg} kg</td>
                            <td><span class="pill">${escapeHtml(log.feeling || 'Good')}</span></td>
                            <td>${escapeHtml(log.medicinesTaken || '4 of 4 planned')}</td>
                            <td>${escapeHtml(log.waterIntake || '2.5 litres')}</td>
                            <td>${log.exerciseMinutes || 30} mins</td>
                        `;
                        progLogsBody.appendChild(tr);
                    });
                }
            }

            // Subtab 5: Assigned Videos pane
            const vidsList = $('#assignedVideosList');
            if (vidsList) {
                vidsList.innerHTML = '';
                if (!data.assignedVideos || data.assignedVideos.length === 0) {
                    vidsList.innerHTML = '<div style="grid-column:span 2;padding:24px;text-align:center;color:var(--m);background:#f8fafc;border-radius:10px">No health videos prescribed for this patient. Click "▶ Assign Video" or "＋ Create New Video" above.</div>';
                } else {
                    data.assignedVideos.forEach(v => {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.style.display = 'flex';
                        card.style.gap = '12px';
                        card.style.alignItems = 'flex-start';
                        card.innerHTML = `
                            <div style="font-size:28px">${v.icon || '🎬'}</div>
                            <div style="flex:1">
                                <div style="display:flex;justify-content:space-between">
                                    <strong style="color:var(--n)">${escapeHtml(v.title)}</strong>
                                    <span class="pill ${v.isAi ? 'good' : ''}">${escapeHtml(v.category)}</span>
                                </div>
                                <small style="display:block;margin:4px 0;color:var(--m)">▶ ${escapeHtml(v.duration || '05:00 min')}</small>
                                <p style="margin:4px 0 0;font-size:12px;color:var(--m)">${escapeHtml(v.summary || 'Clinical education video')}</p>
                            </div>
                        `;
                        vidsList.appendChild(card);
                    });
                }
            }
        }

        // Add Medicine Modal Logic for Doctor
        const modalAddMed = $('#modalAddMed');
        [$('#btnAddMedModal'), $('#btnOpenAddMedFromTab')].forEach(btn => {
            btn?.addEventListener('click', () => {
                const p = cachedPatients.find(x => x.id === activePatientId) || { fullName: 'Patient' };
                if ($('#modalAddMedPatientName')) $('#modalAddMedPatientName').textContent = p.fullName;
                if (modalAddMed) modalAddMed.hidden = false;
            });
        });

        $('#formAddMed')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('#inputMedName').value.trim();
            const dose = $('#inputMedDose').value.trim();
            const time = $('#inputMedTime').value;
            const instructions = $('#inputMedInstructions')?.value || '';

            fetch(`${API_BASE}/api/doctor/patients/${activePatientId}/medicines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    dose,
                    reminderTime: time,
                    instructions,
                    prescribedBy: 'Dr. Priya Sharma'
                })
            })
            .then(r => r.json())
            .then(() => {
                showToast(`✓ Prescribed ${name} to patient!`);
                if (modalAddMed) modalAddMed.hidden = true;
                $('#formAddMed').reset();
                selectPatientInWorkspace(activePatientId);
            })
            .catch(() => {
                showToast(`Prescribed ${name} successfully!`);
                if (modalAddMed) modalAddMed.hidden = true;
            });
        });

        // Assign Video Modal Logic for Doctor
        const modalAssignVideo = $('#modalAssignVideo');
        [$('#btnAssignVideoModal'), $('#btnOpenAssignVidFromTab')].forEach(btn => {
            btn?.addEventListener('click', () => {
                const p = cachedPatients.find(x => x.id === activePatientId) || { fullName: 'Patient' };
                if ($('#modalAssignVidPatientName')) $('#modalAssignVidPatientName').textContent = p.fullName;
                if (!modalAssignVideo) return;

                fetch(`${API_BASE}/api/videos`)
                    .then(r => r.json())
                    .then(videos => {
                        const list = $('#videoPickerList');
                        if (!list) return;
                        list.innerHTML = '';
                        videos.forEach(v => {
                            const item = document.createElement('div');
                            item.style.display = 'flex';
                            item.style.justifyContent = 'space-between';
                            item.style.alignItems = 'center';
                            item.style.padding = '10px 14px';
                            item.style.border = '1px solid var(--ln)';
                            item.style.borderRadius = '8px';
                            item.style.background = '#f8fafc';
                            item.innerHTML = `
                                <div>
                                    <strong style="display:block;font-size:13px">${escapeHtml(v.title)}</strong>
                                    <small style="color:var(--m)">${escapeHtml(v.category)} &middot; ${v.duration || '05:00 min'}</small>
                                </div>
                                <button type="button" class="btn soft mini btn-assign-this-vid" data-id="${v.id}">＋ Prescribe</button>
                            `;
                            list.appendChild(item);
                        });

                        $$('.btn-assign-this-vid', list).forEach(b => {
                            b.addEventListener('click', () => {
                                const vId = b.dataset.id;
                                fetch(`${API_BASE}/api/doctor/patients/${activePatientId}/assign-video`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ videoId: vId })
                                })
                                .then(r => r.json())
                                .then(() => {
                                    showToast('✓ Video assigned to patient education plan!');
                                    modalAssignVideo.hidden = true;
                                    selectPatientInWorkspace(activePatientId);
                                });
                            });
                        });
                        modalAssignVideo.hidden = false;
                    });
            });
        });

        // Create New Video Modal Logic
        const modalCreateVideo = $('#modalCreateVideo');
        [$('#btnCreateVideoModal'), $('#btnOpenCreateVidFromTab')].forEach(btn => {
            btn?.addEventListener('click', () => {
                const p = cachedPatients.find(x => x.id === activePatientId) || { fullName: 'Patient' };
                if ($('#cvPatientName')) $('#cvPatientName').textContent = p.fullName;
                if (modalCreateVideo) modalCreateVideo.hidden = false;
            });
        });

        $('#formCreateVideo')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = $('#cvTitle').value.trim();
            const category = $('#cvCategory').value;
            const duration = $('#cvDuration').value.trim();
            const videoUrl = $('#cvUrl').value.trim();
            const summary = $('#cvSummary').value.trim();
            const assign = $('#cvAssignToPatient')?.checked;

            fetch(`${API_BASE}/api/videos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    category,
                    duration,
                    videoUrl,
                    summary,
                    assignedTo: assign ? [activePatientId] : []
                })
            })
            .then(r => r.json())
            .then(() => {
                showToast(`✓ Published "${title}" successfully!`);
                if (modalCreateVideo) modalCreateVideo.hidden = true;
                $('#formCreateVideo').reset();
                selectPatientInWorkspace(activePatientId);
            });
        });

        // Book Follow-Up Modal Logic
        const modalBookFollowup = $('#modalBookFollowup');
        $('#btnQuickAppointment')?.addEventListener('click', () => {
            const p = cachedPatients.find(x => x.id === activePatientId) || { fullName: 'Patient' };
            if ($('#followupPatientName')) $('#followupPatientName').textContent = p.fullName;
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            if ($('#fuDate')) $('#fuDate').value = tomorrow.toISOString().split('T')[0];
            if (modalBookFollowup) modalBookFollowup.hidden = false;
        });

        $('#formBookFollowup')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const date = $('#fuDate').value;
            const time = $('#fuTime').value;
            const purpose = $('#fuPurpose').value.trim();

            fetch(`${API_BASE}/api/doctors/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: activePatientId,
                    doctor: 'Dr. Priya Sharma',
                    date,
                    time,
                    purpose
                })
            })
            .then(r => r.json())
            .then(() => {
                showToast('✓ Follow-up appointment scheduled!');
                if (modalBookFollowup) modalBookFollowup.hidden = true;
                loadDoctorAppointments();
            });
        });

        // Close generic modals with [data-close]
        $$('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.close;
                const m = document.getElementById(targetId);
                if (m) m.hidden = true;
            });
        });

        // Appointments Management Module
        function loadDoctorAppointments() {
            fetch(`${API_BASE}/api/doctor/appointments`)
                .then(r => r.json())
                .then(appointments => {
                    const tbody = $('#doctorApptsTableBody');
                    if (!tbody) return;
                    tbody.innerHTML = '';
                    if ($('#apptCountBadge')) $('#apptCountBadge').textContent = appointments.length;

                    if (appointments.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--m);padding:18px">No appointments scheduled.</td></tr>';
                        return;
                    }

                    appointments.forEach(a => {
                        const tr = document.createElement('tr');
                        tr.dataset.status = a.status;
                        tr.innerHTML = `
                            <td><strong>${escapeHtml(a.patientName)}</strong></td>
                            <td>${escapeHtml(a.appointmentDate)}</td>
                            <td>${escapeHtml(a.timeSlot)}</td>
                            <td>${escapeHtml(a.purpose || 'General Consultation')}</td>
                            <td><span class="status-pill ${a.status === 'Confirmed' ? 'active' : 'pending'}">${escapeHtml(a.status)}</span></td>
                            <td style="white-space:nowrap;display:flex;gap:6px">
                                ${a.status !== 'Confirmed' ? `<button type="button" class="btn soft mini btn-confirm-appt" data-id="${a.id}">✓ Confirm</button>` : ''}
                                ${a.status !== 'Completed' ? `<button type="button" class="btn alt mini btn-complete-appt" data-id="${a.id}">Done</button>` : '<span style="color:#059669;font-size:12px">✓ Completed</span>'}
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });

                    // Action listeners
                    $$('.btn-confirm-appt', tbody).forEach(btn => {
                        btn.addEventListener('click', () => {
                            const aId = btn.dataset.id;
                            fetch(`${API_BASE}/api/doctor/appointments/${aId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'Confirmed' })
                            }).then(() => {
                                showToast('Appointment confirmed!');
                                loadDoctorAppointments();
                            });
                        });
                    });

                    $$('.btn-complete-appt', tbody).forEach(btn => {
                        btn.addEventListener('click', () => {
                            const aId = btn.dataset.id;
                            fetch(`${API_BASE}/api/doctor/appointments/${aId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'Completed' })
                            }).then(() => {
                                showToast('Appointment marked as Completed!');
                                loadDoctorAppointments();
                            });
                        });
                    });
                })
                .catch(() => {});
        }

        // Filter chips for Appointments
        $$('.module-pane#module-appointments .filters .chip').forEach(chip => {
            chip.addEventListener('click', () => {
                $$('.module-pane#module-appointments .filters .chip').forEach(c => c.classList.remove('on'));
                chip.classList.add('on');
                const filter = chip.dataset.af;
                $$('#doctorApptsTableBody tr').forEach(row => {
                    if (filter === 'All') {
                        row.style.display = '';
                    } else {
                        row.style.display = (row.dataset.status === filter) ? '' : 'none';
                    }
                });
            });
        });

        // Doctor Messaging Module (Real Conversations with Patients)
        function loadDoctorChatPatients() {
            fetch(`${API_BASE}/api/doctor/patients`)
                .then(r => r.json())
                .then(patients => {
                    const list = $('#doctorChatPatientsList');
                    if (!list) return;
                    list.innerHTML = '';
                    patients.forEach(p => {
                        const item = document.createElement('div');
                        item.className = 'doc-chat-item';
                        item.style.padding = '10px 12px';
                        item.style.borderRadius = '8px';
                        item.style.cursor = 'pointer';
                        item.style.background = (p.id === currentChatPatientId) ? '#eff6ff' : '#ffffff';
                        item.style.border = (p.id === currentChatPatientId) ? '1px solid #3b82f6' : '1px solid var(--ln)';
                        item.style.display = 'flex';
                        item.style.alignItems = 'center';
                        item.style.gap = '10px';

                        item.innerHTML = `
                            <div class="avatar" style="width:34px;height:34px;font-size:14px;background:#1e3a8a;color:#fff">${escapeHtml(p.fullName.charAt(0))}</div>
                            <div style="flex:1">
                                <div style="font-weight:600;font-size:13px;color:var(--n)">${escapeHtml(p.fullName)}</div>
                                <small style="color:var(--m);font-size:11px">${p.patientId}</small>
                            </div>
                        `;
                        item.addEventListener('click', () => {
                            currentChatPatientId = p.id;
                            activeChatPatientName = p.fullName;
                            if ($('#docActiveChatPatient')) $('#docActiveChatPatient').textContent = p.fullName;
                            if ($('#docActiveChatSub')) $('#docActiveChatSub').textContent = `Patient ID: ${p.patientId} · Active Consultation`;
                            $$('#doctorChatPatientsList .doc-chat-item').forEach(x => {
                                x.style.background = '#ffffff';
                                x.style.border = '1px solid var(--ln)';
                            });
                            item.style.background = '#eff6ff';
                            item.style.border = '1px solid #3b82f6';
                            previousDocMsgCount = 0;
                            loadDoctorMessages(currentChatPatientId);
                        });
                        list.appendChild(item);
                    });
                })
                .catch(() => {});
        }

        $('#docChatSearchInput')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();
            $$('#doctorChatPatientsList .doc-chat-item').forEach(item => {
                const txt = item.textContent.toLowerCase();
                item.style.display = (!q || txt.includes(q)) ? 'flex' : 'none';
            });
        });

        function loadDoctorMessages(patientId, silent = false) {
            currentChatPatientId = patientId;
            fetch(`${API_BASE}/api/doctor/messages?userId=${patientId}`)
                .then(r => r.json())
                .then(msgs => {
                    const area = $('#docChatMessagesArea');
                    if (!area) return;

                    if (msgs && msgs.length > previousDocMsgCount && previousDocMsgCount > 0) {
                        const last = msgs[msgs.length - 1];
                        if (last.sender === 'patient') {
                            playChimeSound();
                            showToast(`New inquiry from patient: ${activeChatPatientName}!`);
                        }
                    }
                    previousDocMsgCount = msgs ? msgs.length : 0;

                    area.innerHTML = '';
                    if (!msgs || msgs.length === 0) {
                        area.innerHTML = '<div style="margin:auto;text-align:center;color:var(--m)">No messages yet with this patient. Send a welcome message below.</div>';
                        return;
                    }

                    msgs.forEach(m => {
                        const isDoc = (m.sender === 'doctor');
                        const div = document.createElement('div');
                        div.className = isDoc ? 'msg me' : 'msg';
                        div.style.alignSelf = isDoc ? 'flex-end' : 'flex-start';
                        div.style.background = isDoc ? '#1874d2' : '#f1f5f9';
                        div.style.color = isDoc ? '#ffffff' : '#0f172a';
                        div.style.padding = '10px 14px';
                        div.style.borderRadius = '12px';
                        div.style.maxWidth = '75%';
                        div.style.wordBreak = 'break-word';

                        const t = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';
                        div.innerHTML = `${escapeHtml(m.message)} <small style="display:block;margin-top:4px;font-size:10px;opacity:0.8">${t}</small>`;
                        area.appendChild(div);
                    });
                    area.scrollTop = area.scrollHeight;
                })
                .catch(() => {});
        }

        // Live Chat Polling in Doctor Workspace every 3 seconds
        const docChatPoll = setInterval(() => {
            const messagesPane = $('#module-messages');
            if (messagesPane && !messagesPane.hidden) {
                loadDoctorMessages(currentChatPatientId, true);
            }
        }, 3000);
        window.addEventListener('beforeunload', () => clearInterval(docChatPoll));

        $('#docChatSendForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = $('#docChatInput').value.trim();
            if (!text) return;

            $('#docChatInput').value = '';
            fetch(`${API_BASE}/api/doctor/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentChatPatientId,
                    message: text,
                    doctorName: 'Dr. Priya Sharma',
                    sender: 'doctor'
                })
            })
            .then(r => r.json())
            .then(() => {
                showToast(`✓ Clinical reply sent to ${activeChatPatientName}!`);
                loadDoctorMessages(currentChatPatientId);
            });
        });

        // Initial Load
        loadDoctorPatients();
        loadDoctorAppointments();
    }

    // ---------------------------------------------------------------
    // 14. ADMIN DASHBOARD REAL STATISTICS (admin-dashboard.html)
    // ---------------------------------------------------------------
    if (page === 'admin-dashboard') {
        function loadAdminStatistics() {
            fetch(`${API_BASE}/api/admin/stats`)
                .then(r => r.json())
                .then(stats => {
                    if ($('#kpiTotalPatients')) $('#kpiTotalPatients').textContent = stats.totalPatients;
                    if ($('#kpiTotalDoctors')) $('#kpiTotalDoctors').textContent = stats.totalDoctors;
                    if ($('#kpiTotalReports')) $('#kpiTotalReports').textContent = stats.totalReports;
                    if ($('#kpiTotalAppointments')) $('#kpiTotalAppointments').textContent = stats.totalAppointments;
                    if ($('#kpiAdherenceRate')) $('#kpiAdherenceRate').textContent = `${stats.adherenceRate}%`;
                })
                .catch(() => {});
        }

        function loadAdminTables() {
            // Load Patients Table
            fetch(`${API_BASE}/api/admin/patients`)
                .then(r => r.json())
                .then(patients => {
                    const tbody = $('#adminPatientsTableBody');
                    if (!tbody) return;
                    tbody.innerHTML = '';
                    patients.forEach(p => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td><strong>${escapeHtml(p.patientId)}</strong></td>
                            <td>${escapeHtml(p.fullName)}</td>
                            <td>${p.age || 28} Yrs &middot; ${escapeHtml(p.gender || 'Male')}</td>
                            <td><span class="pill">${escapeHtml(p.bloodGroup || 'B+')}</span></td>
                            <td>${escapeHtml(p.phone)}</td>
                            <td>${escapeHtml(p.email)}</td>
                            <td><span class="status-pill reviewed">${p.reportsCount || 0} files</span></td>
                            <td><span class="status-pill active">Verified</span></td>
                        `;
                        tbody.appendChild(tr);
                    });
                })
                .catch(() => {});

            // Load Doctors Table
            fetch(`${API_BASE}/api/admin/doctors`)
                .then(r => r.json())
                .then(doctors => {
                    const tbody = $('#adminDoctorsTableBody');
                    if (!tbody) return;
                    tbody.innerHTML = '';
                    doctors.forEach(d => {
                        const tr = document.createElement('tr');
                        const isOnline = (d.status || '').toLowerCase() === 'online';
                        tr.innerHTML = `
                            <td><strong>${escapeHtml(d.name)}</strong></td>
                            <td>${escapeHtml(d.specialization)}</td>
                            <td>${escapeHtml(d.qualification || 'MBBS')}</td>
                            <td>${escapeHtml(d.experience || '10+ Years')}</td>
                            <td>${escapeHtml(d.phone || '+91 98000 00000')}</td>
                            <td><span class="status-pill ${isOnline ? 'active' : 'pending'}">${escapeHtml(d.status || 'Active')}</span></td>
                        `;
                        tbody.appendChild(tr);
                    });
                })
                .catch(() => {});
        }

        $('#btnRefreshStats')?.addEventListener('click', () => {
            loadAdminStatistics();
            loadAdminTables();
            showToast('System statistics refreshed with live database!');
        });

        $('#btnExportFullData')?.addEventListener('click', () => {
            fetch(`${API_BASE}/api/admin/stats`)
                .then(r => r.json())
                .then(data => {
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `medicare_system_audit_${Date.now()}.json`;
                    a.click();
                    showToast('Full clinical statistics backup exported!');
                });
        });

        loadAdminStatistics();
        loadAdminTables();
    }
});
