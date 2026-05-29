// script.js - Application Logic

document.addEventListener('DOMContentLoaded', () => {
    
    // Auth Check
    const path = window.location.pathname;
    const isAuthPage = path.endsWith('index.html') || path.endsWith('signup.html') || path === '/' || path.endsWith('Attendancesystem/');
    
    if (!isAuthPage) {
        Store.requireAuth();
        const user = Store.getCurrentUser();
        const nameDisplay = document.getElementById('user-name-display');
        if (nameDisplay && user) {
            nameDisplay.textContent = user.full_name;
        }
    } else if (Store.getCurrentUser()) {
        // If already logged in and on an auth page, redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }

    // --- Helpers ---
    function showError(msg) {
        const el = document.getElementById('error-msg');
        if (el) {
            el.textContent = msg;
            el.style.display = 'block';
        }
    }
    
    function showSuccess(msg) {
        const el = document.getElementById('success-msg');
        if (el) {
            el.textContent = msg;
            el.style.display = 'block';
        }
    }
    
    function hideAlerts() {
        const err = document.getElementById('error-msg');
        const suc = document.getElementById('success-msg');
        if (err) err.style.display = 'none';
        if (suc) suc.style.display = 'none';
    }

    // --- Global Event Listeners ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Store.logout();
            window.location.href = 'index.html';
        });
    }

    const logoutCardBtn = document.getElementById('logoutCardBtn');
    if (logoutCardBtn) {
        logoutCardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Store.logout();
            window.location.href = 'index.html';
        });
    }

    // --- Page Specific Logic ---
    
    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            hideAlerts();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            
            const user = Store.getUser(u, p);
            if (user) {
                Store.login(user);
                window.location.href = 'dashboard.html';
            } else {
                showError("Invalid username or password.");
            }
        });
    }

    // Signup
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            hideAlerts();
            const fn = document.getElementById('fullName').value;
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            const cp = document.getElementById('confirmPassword').value;
            
            if (p !== cp) {
                showError("Passwords do not match.");
                return;
            }
            if (Store.userExists(u)) {
                showError("Username already exists. Please choose another.");
                return;
            }
            
            Store.addUser({
                username: u,
                password: p,
                full_name: fn
            });
            
            showSuccess("Account created successfully! Redirecting to login...");
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }

    // Dashboard
    const statTotal = document.getElementById('stat-total');
    if (statTotal) {
        const stats = Store.getStats();
        statTotal.textContent = stats.total;
        document.getElementById('stat-bsit').textContent = stats.bsit || 0;
        document.getElementById('stat-bsba').textContent = stats.bsba || 0;
        document.getElementById('stat-bshm').textContent = stats.bshm || 0;
        document.getElementById('stat-bstm').textContent = stats.bstm || 0;
    }

    // Add Student
    const addStudentForm = document.getElementById('addStudentForm');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            hideAlerts();
            
            const student = {
                student_id: document.getElementById('student_id').value,
                full_name: document.getElementById('full_name').value,
                course: document.getElementById('course').value,
                year_level: document.getElementById('year_level').value,
                email: document.getElementById('email').value
            };
            
            if (Store.addStudent(student)) {
                showSuccess("Student added successfully!");
                addStudentForm.reset();
            } else {
                showError("A student with this ID already exists.");
            }
        });
    }

    // View Students / Search Students (Render Row Logic)
    window.deleteStudent = function(id) {
        if (confirm("Are you sure you want to delete this student?")) {
            if (Store.deleteStudent(id)) {
                alert("Student deleted successfully!");
                // Refresh current view
                if (document.getElementById('student-table-body')) {
                    renderStudents(Store.getStudents().reverse(), 'student-table-body');
                    document.getElementById('total-students-count').textContent = Store.getStudents().length;
                } else if (document.getElementById('searchForm')) {
                    document.getElementById('searchForm').dispatchEvent(new Event('submit'));
                }
            } else {
                alert("Error deleting student.");
            }
        }
    };

    function renderStudents(students, tbodyId) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        
        tbody.innerHTML = '';
        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No students found</td></tr>';
            return;
        }
        
        students.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.student_id}</td>
                <td>${s.full_name}</td>
                <td>${s.course}</td>
                <td>Year ${s.year_level}</td>
                <td>${s.email}</td>
                <td>
                    <button class="btn btn-sm btn-delete" onclick="deleteStudent('${s.student_id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // View Students Specific
    if (document.getElementById('student-table-body')) {
        const students = Store.getStudents().reverse(); // Show newest first
        renderStudents(students, 'student-table-body');
        const countDisplay = document.getElementById('total-students-count');
        if (countDisplay) countDisplay.textContent = students.length;

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value;
                let results = students;
                if (term.trim() !== '') {
                    results = Store.searchStudents(term).reverse();
                }
                renderStudents(results, 'student-table-body');
                if (countDisplay) countDisplay.textContent = results.length;
            });
        }
    }

});
