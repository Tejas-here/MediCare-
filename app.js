/* ===================================================================
   MediCare+ Healthcare Platform - Frontend Client Application
   Connects to Spring Boot REST APIs & MySQL Database
   =================================================================== */

// Automatically switch between relative path (if served on port 8080) and localhost:8080 (if standalone)
const API_BASE = window.location.origin.includes(':8080') ? '' : 'http://localhost:8080';

// Session management
function getCurrentUser() {
    try {
        const u = localStorage.getItem('medicare_user');
        if (u) return JSON.parse(u);
    } catch (e) {
        console.error('Failed to parse user from localStorage', e);
    }
    // Default fallback demo patient
    return { id: 1, fullName: 'Avishkar', patientId: 'MED-1001', email: 'avishkar@example.com' };
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('medicare_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('medicare_user');
    }
}

// Global Toast helper
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) {
        alert(msg);
        return;
    }
    toast.textContent = msg;
    toast.style.background = isError ? '#d93025' : '#137333';
    toast.style.color = '#fff';
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const user = getCurrentUser();
    const page = document.body.dataset.page || '';

    // ---------------------------------------------------------------
    // 1. Common UI updates across all authenticated pages
    // ---------------------------------------------------------------
    const userContainer = $('.user');
    if (userContainer && user) {
        const avatar = $('.avatar', userContainer);
        const nameSpan = userContainer.querySelector('span:not(.avatar)');
        if (avatar && user.fullName) {
            avatar.textContent = user.fullName.charAt(0).toUpperCase();
        }
        if (nameSpan && user.fullName) {
            nameSpan.innerHTML = `${user.fullName} &#x2304;`;
        }
    }

    // Welcome title & breadcrumb updates
    const welcomeTitle = $('.welcome h1');
    if (welcomeTitle && page === 'dashboard' && user.fullName) {
        welcomeTitle.textContent = `Welcome, ${user.fullName}!`;
    }
    const crumb = $('.crumb');
    if (crumb && page === 'dashboard' && user.fullName) {
        crumb.innerHTML = `Home <span>/</span> Welcome, ${user.fullName}!`;
    }

    // Sidebar on smaller screens
    const sidebar = $('#side');
    $('#hamb')?.addEventListener('click', () => sidebar?.classList.toggle('open'));

    // Logout handler
    $('#logout')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            setCurrentUser(null);
            location.href = 'login.html';
        }
    });

    // Notification bell
    $('#bell')?.addEventListener('click', () => alert('You are all caught up! No new notifications.'));

    // ---------------------------------------------------------------
    // 2. Dashboard Page Logic
    // ---------------------------------------------------------------
    if (page === 'dashboard') {
        fetch(`${API_BASE}/api/dashboard?userId=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.todayFormatted) {
                    const todayEl = $('.welcome .card h3');
                    if (todayEl) todayEl.textContent = data.todayFormatted;
                }
            })
            .catch(err => console.warn('Dashboard API error (backend might be starting):', err));
    }

    // ---------------------------------------------------------------
    // 3. Medical Reports Page Logic
    // ---------------------------------------------------------------
    if (page === 'reports') {
        const reportTableBody = $('#rb');
        const reportModal = $('#rmodal');
        let currentFilter = 'All';

        function loadReports(cat = 'All', search = '') {
            let url = `${API_BASE}/api/reports?userId=${user.id}`;
            if (cat && cat !== 'All' && cat !== 'All Reports') {
                url += `&category=${encodeURIComponent(cat)}`;
            }
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            fetch(url)
                .then(r => r.json())
                .then(reports => {
                    renderReports(reports);
                    loadReportStats();
                })
                .catch(e => console.warn('Could not load reports from API:', e));
        }

        function renderReports(reports) {
            if (!reportTableBody) return;
            reportTableBody.innerHTML = '';
            if (reports.length === 0) {
                reportTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--mu)">No reports found. Click "Upload Report" to add one!</td></tr>';
                const countText = $('#rct');
                if (countText) countText.textContent = 'Showing 0 of 0 reports';
                return;
            }

            reports.forEach(r => {
                const tr = document.createElement('tr');
                const isPdf = (r.fileName || '').toLowerCase().endsWith('.pdf') || r.category === 'Blood Test' || r.category === 'ECG';
                const fileIconClass = isPdf ? 'file pdf' : 'file img';
                const iconText = isPdf ? 'PDF' : '▧';
                const statusClass = (r.status || 'Reviewed').toLowerCase() === 'reviewed' ? 'pill good' : 'pill wait';

                tr.innerHTML = `
                    <td>
                        <div class="row">
                            <div class="${fileIconClass}">${iconText}</div>
                            <div>
                                <strong>${escapeHtml(r.reportName)}</strong>
                                <small>${escapeHtml(r.fileName || 'document.pdf')} &middot; ${escapeHtml(r.fileSize || '1.0 MB')}</small>
                            </div>
                        </div>
                    </td>
                    <td><span class="pill">${escapeHtml(r.category)}</span></td>
                    <td>${escapeHtml(r.reportDate)}</td>
                    <td>${escapeHtml(r.doctorOrLab || 'Clinic Lab')}</td>
                    <td><span class="${statusClass}">${escapeHtml(r.status || 'Reviewed')}</span></td>
                    <td>
                        <div class="acts">
                            <span class="mini download-btn" data-id="${r.id}" title="Download Report">View / &darr;</span>
                            <span class="mini delete-btn" data-id="${r.id}" title="Delete Report" style="color:var(--r);cursor:pointer">&times;</span>
                        </div>
                    </td>
                `;
                reportTableBody.appendChild(tr);
            });

            const countText = $('#rct');
            if (countText) countText.textContent = `Showing ${reports.length} of ${reports.length} reports`;

            // Attach download and delete events
            $$('.download-btn', reportTableBody).forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    window.open(`${API_BASE}/api/reports/${id}/download`, '_blank');
                });
            });

            $$('.delete-btn', reportTableBody).forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    if (confirm('Are you sure you want to delete this report?')) {
                        fetch(`${API_BASE}/api/reports/${id}`, { method: 'DELETE' })
                            .then(r => r.json())
                            .then(() => {
                                showToast('Report deleted successfully');
                                loadReports(currentFilter);
                            })
                            .catch(err => alert('Failed to delete report: ' + err));
                    }
                });
            });
        }

        function loadReportStats() {
            fetch(`${API_BASE}/api/reports/stats?userId=${user.id}`)
                .then(r => r.json())
                .then(stats => {
                    const rc = $('#rc');
                    if (rc) rc.textContent = stats.total ?? 0;
                })
                .catch(() => {});
        }

        // Modal triggers
        $('#addReport')?.addEventListener('click', () => { if (reportModal) reportModal.hidden = false; });
        $('#rcancel')?.addEventListener('click', () => { if (reportModal) reportModal.hidden = true; });

        // Search reports
        $('#rs')?.addEventListener('input', e => {
            loadReports(currentFilter, e.target.value.trim());
        });

        // Filter chips
        $$('#rf .chip').forEach(chip => {
            chip.addEventListener('click', () => {
                $$('#rf .chip').forEach(c => c.classList.remove('on'));
                chip.classList.add('on');
                currentFilter = chip.dataset.f || chip.textContent.trim();
                loadReports(currentFilter, $('#rs')?.value.trim() || '');
            });
        });

        // Export CSV from backend
        $('#export')?.addEventListener('click', () => {
            window.location.href = `${API_BASE}/api/reports/export/csv?userId=${user.id}`;
        });

        // Upload Report Form Submission
        $('#rfm')?.addEventListener('submit', event => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            formData.append('userId', user.id);

            const errEl = $('#rerr');
            if (errEl) errEl.textContent = 'Saving report...';

            fetch(`${API_BASE}/api/reports`, {
                method: 'POST',
                body: formData
            })
            .then(r => {
                if (!r.ok) throw new Error('Upload failed');
                return r.json();
            })
            .then(saved => {
                if (errEl) errEl.textContent = '';
                if (reportModal) reportModal.hidden = true;
                form.reset();
                showToast(`Report "${saved.reportName}" saved to database!`);
                loadReports(currentFilter);
            })
            .catch(err => {
                if (errEl) {
                    errEl.style.color = '#d93025';
                    errEl.textContent = 'Error uploading report: ' + err.message;
                }
            });
        });

        // Initial reports load
        loadReports();
    }

    // ---------------------------------------------------------------
    // 4. Medicines Page Logic
    // ---------------------------------------------------------------
    if (page === 'medicine') {
        const medList = $('#ml');
        const medModal = $('#mmodal');

        function loadMedicines() {
            fetch(`${API_BASE}/api/medicines?userId=${user.id}`)
                .then(r => r.json())
                .then(renderMedicines)
                .catch(e => console.warn('Could not load medicines from API:', e));
            loadMedicineStats();
        }

        function renderMedicines(medicines) {
            if (!medList) return;
            medList.innerHTML = '';
            if (medicines.length === 0) {
                medList.innerHTML = '<p style="padding:20px;color:var(--mu);text-align:center">No medicines added yet. Click "+ Add Medicine" to create your schedule.</p>';
                return;
            }

            medicines.forEach(m => {
                const item = document.createElement('div');
                item.className = 'med';
                item.innerHTML = `
                    <div class="fi">💊</div>
                    <div class="med-info">
                        <strong>${escapeHtml(m.name)}</strong>
                        <small>${escapeHtml(m.dose)}</small>
                    </div>
                    <span class="time">&#x25F7; ${escapeHtml(m.reminderTime)}</span>
                    <label title="Toggle reminder">
                        <input class="toggle" type="checkbox" data-id="${m.id}" ${m.reminderActive ? 'checked' : ''}/>
                    </label>
                    <button class="mini delete-med" data-id="${m.id}" title="Delete medicine" style="color:var(--r);cursor:pointer">&times;</button>
                `;
                medList.appendChild(item);
            });

            // Toggle reminder listeners
            $$('.toggle', medList).forEach(toggle => {
                toggle.addEventListener('change', () => {
                    const id = toggle.dataset.id;
                    fetch(`${API_BASE}/api/medicines/${id}/toggle`, { method: 'PUT' })
                        .then(r => r.json())
                        .then(() => {
                            showToast('Medicine reminder updated');
                            loadMedicineStats();
                        });
                });
            });

            // Delete medicine listeners
            $$('.delete-med', medList).forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    if (confirm('Delete this medicine from your schedule?')) {
                        fetch(`${API_BASE}/api/medicines/${id}`, { method: 'DELETE' })
                            .then(r => r.json())
                            .then(() => {
                                showToast('Medicine removed');
                                loadMedicines();
                            });
                    }
                });
            });
        }

        function loadMedicineStats() {
            fetch(`${API_BASE}/api/medicines/stats?userId=${user.id}`)
                .then(r => r.json())
                .then(stats => {
                    const statsCards = $$('.stat strong');
                    if (statsCards.length >= 3) {
                        statsCards[0].textContent = stats.total ?? 4;
                        statsCards[1].textContent = stats.activeReminders ?? 4;
                        statsCards[2].textContent = stats.status ?? 'Active';
                    }
                })
                .catch(() => {});
        }

        $('#addMed')?.addEventListener('click', () => { if (medModal) medModal.hidden = false; });
        $('#mcancel')?.addEventListener('click', () => { if (medModal) medModal.hidden = true; });

        $('#mform')?.addEventListener('submit', event => {
            event.preventDefault();
            const form = event.target;
            const data = {
                userId: user.id,
                name: form.elements['name']?.value.trim(),
                dose: form.elements['dose']?.value.trim(),
                time: form.elements['time']?.value.trim(),
                reminderActive: true
            };

            fetch(`${API_BASE}/api/medicines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(r => r.json())
            .then(saved => {
                if (medModal) medModal.hidden = true;
                form.reset();
                showToast(`Medicine "${saved.name}" added to schedule!`);
                loadMedicines();
            })
            .catch(err => alert('Failed to save medicine: ' + err.message));
        });

        loadMedicines();
    }

    // ---------------------------------------------------------------
    // 5. Doctor Communication Page Logic
    // ---------------------------------------------------------------
    if (page === 'doctor') {
        const bookingModal = $('#bmodal');
        let currentDoctor = 'Dr. Priya Sharma';
        const msgsArea = $('#msgs');
        const chatForm = $('#chatForm');
        const chatText = $('#chatText');
        const chatHead = $('.chat-head');

        function loadDoctors() {
            fetch(`${API_BASE}/api/doctors`)
                .then(r => r.json())
                .then(doctors => {
                    const docList = $('.doctor-list');
                    if (!docList || doctors.length === 0) return;
                    docList.innerHTML = '';
                    doctors.forEach(d => {
                        const isOnline = (d.status || '').toLowerCase() === 'online';
                        const dotClass = isOnline ? 'dot' : '';
                        const docDiv = document.createElement('div');
                        docDiv.className = 'doc';
                        docDiv.innerHTML = `
                            <div class="avatar">${escapeHtml(d.avatarInitials || 'DR')}</div>
                            <div style="flex:1">
                                <strong>${escapeHtml(d.name)}</strong>
                                <small>${escapeHtml(d.specialization)} &middot; <span class="${dotClass}">${escapeHtml(d.status)}</span></small>
                            </div>
                            <button class="btn soft doc-chat-btn" data-chat="${escapeHtml(d.name)}" data-spec="${escapeHtml(d.specialization)}">Chat</button>
                        `;
                        docList.appendChild(docDiv);
                    });

                    // Chat buttons
                    $$('.doc-chat-btn', docList).forEach(b => {
                        b.addEventListener('click', () => {
                            currentDoctor = b.dataset.chat;
                            if (chatHead) chatHead.innerHTML = `${escapeHtml(currentDoctor)} <small class="muted" style="font-weight:400">&middot; ${escapeHtml(b.dataset.spec)}</small>`;
                            loadChatMessages(currentDoctor);
                            chatText?.focus();
                        });
                    });
                })
                .catch(() => {});
        }

        function loadChatMessages(doctor) {
            if (!msgsArea) return;
            fetch(`${API_BASE}/api/doctors/chat?doctor=${encodeURIComponent(doctor)}&userId=${user.id}`)
                .then(r => r.json())
                .then(messages => {
                    msgsArea.innerHTML = '';
                    messages.forEach(m => {
                        const isMe = m.sender === 'patient';
                        const div = document.createElement('div');
                        div.className = isMe ? 'msg me' : 'msg';
                        div.innerHTML = `${escapeHtml(m.message)} <small>${formatTime(m.createdAt)}</small>`;
                        msgsArea.appendChild(div);
                    });
                    msgsArea.scrollTop = msgsArea.scrollHeight;
                })
                .catch(() => {});
        }

        function formatTime(iso) {
            if (!iso) return 'Just now';
            try {
                const d = new Date(iso);
                return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } catch (e) {
                return 'Just now';
            }
        }

        // Send Chat
        chatForm?.addEventListener('submit', e => {
            e.preventDefault();
            const text = chatText?.value.trim();
            if (!text) return;

            fetch(`${API_BASE}/api/doctors/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    doctorName: currentDoctor,
                    sender: 'patient',
                    message: text
                })
            })
            .then(r => r.json())
            .then(msg => {
                chatText.value = '';
                const div = document.createElement('div');
                div.className = 'msg me';
                div.innerHTML = `${escapeHtml(msg.message)} <small>Just now</small>`;
                msgsArea?.appendChild(div);
                msgsArea.scrollTop = msgsArea.scrollHeight;
            })
            .catch(err => alert('Failed to send message: ' + err.message));
        });

        // Appointment Modal
        $('#book')?.addEventListener('click', () => { if (bookingModal) bookingModal.hidden = false; });
        $('#bcancel')?.addEventListener('click', () => { if (bookingModal) bookingModal.hidden = true; });

        $('#bform')?.addEventListener('submit', event => {
            event.preventDefault();
            const form = event.target;
            const data = {
                userId: user.id,
                doctor: form.elements['doctor']?.value,
                date: form.elements['date']?.value,
                time: form.elements['time']?.value
            };

            fetch(`${API_BASE}/api/doctors/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(r => r.json())
            .then(appt => {
                if (bookingModal) bookingModal.hidden = true;
                form.reset();
                showToast(`Appointment confirmed with ${appt.doctorName} on ${appt.appointmentDate} at ${appt.timeSlot}!`);
            })
            .catch(err => alert('Failed to book appointment: ' + err.message));
        });

        $('#remind')?.addEventListener('click', () => {
            showToast('Reminder added for upcoming follow-up visit.');
        });

        loadDoctors();
        loadChatMessages(currentDoctor);
    }

    // ---------------------------------------------------------------
    // 6. Nearby Medical Services Page Logic
    // ---------------------------------------------------------------
    if (page === 'services') {
        const servicesList = $('#sl');
        let currentType = 'All';

        function loadServices(type = 'All', search = '') {
            let url = `${API_BASE}/api/services?`;
            if (type && type !== 'All') url += `type=${encodeURIComponent(type)}&`;
            if (search) url += `search=${encodeURIComponent(search)}`;

            fetch(url)
                .then(r => r.json())
                .then(renderServices)
                .catch(() => {});
        }

        function renderServices(services) {
            if (!servicesList) return;
            servicesList.innerHTML = '';
            if (services.length === 0) {
                servicesList.innerHTML = '<p style="padding:20px;color:var(--mu);text-align:center">No services found.</p>';
                return;
            }

            services.forEach(s => {
                const div = document.createElement('div');
                div.className = 'service';
                div.dataset.st = s.serviceType;
                div.innerHTML = `
                    <div class="service-img">${escapeHtml(s.icon || '🏥')}</div>
                    <div>
                        <h3>${escapeHtml(s.name)}</h3>
                        <p>${escapeHtml(s.address)} &middot; ${escapeHtml(s.distance)}<br/>&phone; ${escapeHtml(s.phone)}</p>
                    </div>
                    <div class="service-actions">
                        <a class="btn soft" href="tel:${escapeHtml(s.phone.replace(/[^0-9+]/g, ''))}">Call</a>
                        <button class="btn alt service-map-btn" data-name="${escapeHtml(s.name)}">View Map</button>
                    </div>
                `;
                servicesList.appendChild(div);
            });

            $$('.service-map-btn', servicesList).forEach(btn => {
                btn.addEventListener('click', () => {
                    const query = btn.dataset.name || 'Medical Services';
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank', 'noopener');
                });
            });
        }

        $$('#sf .chip').forEach(chip => {
            chip.addEventListener('click', () => {
                $$('#sf .chip').forEach(c => c.classList.remove('on'));
                chip.classList.add('on');
                currentType = chip.dataset.sf || chip.textContent.trim();
                loadServices(currentType);
            });
        });

        loadServices();
    }

    // ---------------------------------------------------------------
    // 7. Instruction Videos Page Logic
    // ---------------------------------------------------------------
    if (page === 'videos') {
        const videoList = $('#vl');
        let currentCat = 'All';

        function loadVideos(cat = 'All', search = '') {
            let url = `${API_BASE}/api/videos?`;
            if (cat && cat !== 'All') url += `category=${encodeURIComponent(cat)}&`;
            if (search) url += `search=${encodeURIComponent(search)}`;

            fetch(url)
                .then(r => r.json())
                .then(renderVideos)
                .catch(() => {});
        }

        function renderVideos(videos) {
            if (!videoList) return;
            videoList.innerHTML = '';
            videos.forEach(v => {
                const article = document.createElement('article');
                article.className = 'card vid';
                article.dataset.vcat = v.category;
                article.innerHTML = `
                    <div class="thumb">
                        ${escapeHtml(v.icon || '▶')}
                        <button class="play play-video-btn" aria-label="Play video" data-title="${escapeHtml(v.title)}">▶</button>
                    </div>
                    <div class="vid-body">
                        <h3>${escapeHtml(v.title)}</h3>
                        <small>▶ ${escapeHtml(v.duration)} &middot; ${escapeHtml(v.tag)}</small>
                    </div>
                `;
                videoList.appendChild(article);
            });

            $$('.play-video-btn', videoList).forEach(btn => {
                btn.addEventListener('click', () => {
                    alert(`Playing video guidance: "${btn.dataset.title}"`);
                });
            });
        }

        $$('#vf .chip').forEach(chip => {
            chip.addEventListener('click', () => {
                $$('#vf .chip').forEach(c => c.classList.remove('on'));
                chip.classList.add('on');
                currentCat = chip.dataset.vf || chip.textContent.trim();
                loadVideos(currentCat);
            });
        });

        loadVideos();
    }

    // ---------------------------------------------------------------
    // 8. Health Improvement / Progress Page Logic
    // ---------------------------------------------------------------
    if (page === 'progress') {
        function loadProgress() {
            fetch(`${API_BASE}/api/progress/summary?userId=${user.id}`)
                .then(r => r.json())
                .then(summary => {
                    const metrics = $$('.metric strong');
                    if (metrics.length >= 4) {
                        metrics[0].textContent = summary.weight || '72 kg';
                        metrics[1].textContent = summary.bloodPressure || '120/80';
                        metrics[2].textContent = summary.hemoglobin || '11.2';
                        metrics[3].textContent = summary.stepsToday || '8,000';
                    }
                })
                .catch(() => {});
        }

        $('#logForm')?.addEventListener('submit', event => {
            event.preventDefault();
            const form = event.target;
            const weightVal = parseFloat(form.elements['weight']?.value);
            const feelVal = form.elements['feel']?.value;

            if (isNaN(weightVal)) {
                alert('Please enter a valid weight.');
                return;
            }

            fetch(`${API_BASE}/api/progress/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    weight: weightVal,
                    feel: feelVal
                })
            })
            .then(r => r.json())
            .then(() => {
                showToast('Today health log saved to MySQL database!');
                form.reset();
                loadProgress();
            })
            .catch(err => alert('Failed to save log: ' + err.message));
        });

        loadProgress();
    }

    // ---------------------------------------------------------------
    // 9. Global Search Filter
    // ---------------------------------------------------------------
    const globalSearch = $('#globalSearch');
    globalSearch?.addEventListener('input', () => {
        const query = globalSearch.value.trim().toLowerCase();
        $$('.tile, .tbl tbody tr, .med, .vid, .service, .doc').forEach(item => {
            item.hidden = query !== '' && !item.textContent.toLowerCase().includes(query);
        });
    });
});

// -------------------------------------------------------------------
// 10. Authentication Forms (Login & Signup)
// -------------------------------------------------------------------

// Sign Up Handler
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const message = document.getElementById("message");

    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();
        message.textContent = "";
        message.style.color = "#d93025";

        if (password.value !== confirmPassword.value) {
            message.textContent = "Passwords do not match!";
            confirmPassword.focus();
            return;
        }

        if (password.value.length < 6) {
            message.textContent = "Password must contain at least 6 characters.";
            password.focus();
            return;
        }

        const agreeBox = document.getElementById("agree");
        if (agreeBox && !agreeBox.checked) {
            message.textContent = "Please accept the Terms & Privacy Policy.";
            return;
        }

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        message.style.color = "#1874d2";
        message.textContent = "Registering your account in MySQL database...";

        fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName,
                email,
                phone,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                message.style.color = "#137333";
                message.textContent = `Account created successfully! Patient ID: ${data.patientId}. Redirecting to dashboard...`;
                setCurrentUser(data);
                setTimeout(() => {
                    location.href = "dashboard.html";
                }, 1200);
            } else {
                message.style.color = "#d93025";
                message.textContent = data.message || "Registration failed.";
            }
        })
        .catch(err => {
            message.style.color = "#d93025";
            message.textContent = "Error connecting to backend server: " + err.message;
        });
    });
}

// Login Handler
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    const loginMsg = document.getElementById("loginMessage");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        if (loginMsg) {
            loginMsg.textContent = "Logging in...";
            loginMsg.style.color = "#1874d2";
        }

        const patientIdVal = document.getElementById("loginPatientId")?.value.trim();
        const emailVal = document.getElementById("loginEmail")?.value.trim();
        const passwordVal = document.getElementById("loginPassword")?.value;

        const payload = {
            identifier: emailVal || patientIdVal,
            patientId: patientIdVal,
            password: passwordVal
        };

        fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (loginMsg) {
                    loginMsg.style.color = "#137333";
                    loginMsg.textContent = `Welcome back, ${data.fullName}! Redirecting...`;
                }
                setCurrentUser(data);
                setTimeout(() => {
                    location.href = "dashboard.html";
                }, 800);
            } else {
                if (loginMsg) {
                    loginMsg.style.color = "#d93025";
                    loginMsg.textContent = data.message || "Invalid credentials.";
                }
            }
        })
        .catch(err => {
            if (loginMsg) {
                loginMsg.style.color = "#d93025";
                loginMsg.textContent = "Cannot reach backend: " + err.message + ". (Ensure Spring Boot is running on port 8080)";
            }
        });
    });
}

// Utility: escape HTML characters
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
