/* MediCare+ interactions — kept separate from HTML and CSS. */
document.addEventListener('DOMContentLoaded', () => {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    // Sidebar on smaller screens.
    const sidebar = $('#side');
    $('#hamb') ? .addEventListener('click', () => sidebar ? .classList.toggle('open'));

    // Demo logout: return to login page.
    $('#logout') ? .addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) location.href = 'login.html';
    });

    // Notification button.
    $('#bell') ? .addEventListener('click', () => alert('You are all caught up!'));

    // Global search filters visible cards, table rows, and list items on the current page.
    const globalSearch = $('#globalSearch');
    globalSearch ? .addEventListener('input', () => {
        const query = globalSearch.value.trim().toLowerCase();
        $$('.tile, .tbl tbody tr, .medrow, .video, .service, .doctor-card, .progress-card').forEach(item => {
            item.hidden = query !== '' && !item.textContent.toLowerCase().includes(query);
        });
    });

    // Filter chips used on reports, videos, and services pages.
    $$('.chip').forEach(chip => chip.addEventListener('click', () => {
        const group = chip.parentElement;
        if (!group) return;
        $$('.chip', group).forEach(other => other.classList.remove('on'));
        chip.classList.add('on');
        const filter = (chip.dataset.f || chip.dataset.sf || chip.textContent).trim().toLowerCase();
        const page = document.body.dataset.page;
        let items = [];
        if (page === 'reports') items = $$('.tbl tbody tr');
        if (page === 'videos') items = $$('.video');
        if (page === 'services') items = $$('.service');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.hidden = !['all', 'all reports'].includes(filter) && !text.includes(filter);
        });
    }));

    // Reports modal and export.
    const reportModal = $('#rmodal');
    $('#addReport') ? .addEventListener('click', () => { if (reportModal) reportModal.hidden = false; });
    $('#rcancel') ? .addEventListener('click', () => { if (reportModal) reportModal.hidden = true; });
    $('#rs') ? .addEventListener('input', event => {
        const query = event.target.value.toLowerCase().trim();
        $$('.tbl tbody tr').forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(query); });
    });
    $('#export') ? .addEventListener('click', () => {
        const rows = $$('.tbl tr').filter(row => !row.hidden).map(row =>
            $$('th, td', row).map(cell => `"${cell.textContent.trim().replaceAll('"', '""')}"`).join(',')
        );
        const blob = new Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'medicare-reports.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    });
    $('#rfm') ? .addEventListener('submit', event => {
        event.preventDefault();
        alert('Demo: report details validated. Connect a backend to save reports permanently.');
        if (reportModal) reportModal.hidden = true;
    });

    // Medicine modal and reminder toggles.
    const medicineModal = $('#mmodal');
    $('#addMed') ? .addEventListener('click', () => { if (medicineModal) medicineModal.hidden = false; });
    $('#mcancel') ? .addEventListener('click', () => { if (medicineModal) medicineModal.hidden = true; });
    $('#mform') ? .addEventListener('submit', event => {
        event.preventDefault();
        alert('Demo: medicine details received. Connect a backend to store them permanently.');
        if (medicineModal) medicineModal.hidden = true;
        event.target.reset();
    });

    // Appointment booking modal.
    const bookingModal = $('#bmodal');
    $('#book') ? .addEventListener('click', () => { if (bookingModal) bookingModal.hidden = false; });
    $('#bcancel') ? .addEventListener('click', () => { if (bookingModal) bookingModal.hidden = true; });
    $('#bform') ? .addEventListener('submit', event => {
        event.preventDefault();
        alert('Demo: appointment request received. Connect a backend to submit it to a doctor.');
        if (bookingModal) bookingModal.hidden = true;
        event.target.reset();
    });

    // Chat demo.
    $('#chatForm') ? .addEventListener('submit', event => {
        event.preventDefault();
        const input = $('#chatText');
        const message = input ? .value.trim();
        if (!message) return;
        const area = $('.chat-messages, .messages, .chat-body');
        if (area) {
            const bubble = document.createElement('p');
            bubble.className = 'message sent';
            bubble.textContent = message;
            area.append(bubble);
        } else alert(`Message ready to send: ${message}`);
        input.value = '';
    });
    $$('.btn.soft').filter(button => button.textContent.trim() === 'Chat').forEach(button => {
        button.addEventListener('click', () => $('#chatText') ? .focus());
    });
    $('#remind') ? .addEventListener('click', () => alert('Reminder feature is a demo.'));

    // Progress log demo.
    $('#logForm') ? .addEventListener('submit', event => {
        event.preventDefault();
        alert('Your health log has been checked. Connect a backend to save it permanently.');
    });
    // Demo login validation/navigation.
    $('#loginForm') ? .addEventListener('submit', event => {
        event.preventDefault();
        location.href = 'dashboard.html';
    });

    // Video play buttons show a simple notice when no video source is configured.
    $$('.play').forEach(button => button.addEventListener('click', () => {
        const card = button.closest('.video');
        const video = $('video', card || document);
        if (video) video.play().catch(() => alert('Video source is not configured yet.'));
        else alert('Add a video source to enable playback.');
    }));

    // Map buttons open a map search based on the service card's visible text.
    $$('.service .btn.alt, .service button').forEach(button => {
        if (button.textContent.toLowerCase().includes('map')) button.addEventListener('click', () => {
            const title = $('.service-title, h3, h4', button.closest('.service') || document) ? .textContent || 'medical services';
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}`, '_blank', 'noopener');
        });
    });
});


const signupForm = document.getElementById("signupForm");
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

    if (password.value.length < 8) {
        message.textContent = "Password must contain at least 8 characters.";
        password.focus();
        return;
    }

    if (!document.getElementById("agree").checked) {
        message.textContent = "Please accept the Terms & Privacy Policy.";
        return;
    }

    message.style.color = "#16803c";
    message.textContent =
        "Form validated successfully! Backend registration is not connected yet.";

    console.log("Registration form validated:", {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value
    });
});