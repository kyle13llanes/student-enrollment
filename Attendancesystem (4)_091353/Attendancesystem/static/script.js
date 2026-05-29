// script.js — UI logic; all data via Flask API (client ↔ server)

document.addEventListener("DOMContentLoaded", async () => {
    const path = window.location.pathname;
    const isAuthPage =
        path === "/" || path.endsWith("/signup") || path.endsWith("index.html");

    let sessionData = null;
    try {
        sessionData = await API.getSession();
    } catch {
        sessionData = { logged_in: false };
    }

    if (!isAuthPage) {
        if (!sessionData.logged_in) {
            window.location.href = "/";
            return;
        }
        const nameDisplay = document.getElementById("user-name-display");
        if (nameDisplay && sessionData.user) {
            nameDisplay.textContent = sessionData.user.full_name;
        }
    } else if (sessionData.logged_in) {
        window.location.href = "/dashboard";
        return;
    }

    function showError(msg) {
        const el = document.getElementById("error-msg");
        if (el) {
            el.textContent = msg;
            el.style.display = "block";
        }
    }

    function showSuccess(msg) {
        const el = document.getElementById("success-msg");
        if (el) {
            el.textContent = msg;
            el.style.display = "block";
        }
    }

    function hideAlerts() {
        const err = document.getElementById("error-msg");
        const suc = document.getElementById("success-msg");
        if (err) err.style.display = "none";
        if (suc) suc.style.display = "none";
    }

    async function doLogout() {
        try {
            await API.logout();
        } catch {
            /* session may already be cleared */
        }
        window.location.href = "/";
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", doLogout);

    const logoutCardBtn = document.getElementById("logoutCardBtn");
    if (logoutCardBtn) {
        logoutCardBtn.addEventListener("click", (e) => {
            e.preventDefault();
            doLogout();
        });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            hideAlerts();
            const u = document.getElementById("username").value.trim();
            const p = document.getElementById("password").value;
            try {
                await API.login(u, p);
                window.location.href = "/dashboard";
            } catch (err) {
                showError(err.message || "Login failed.");
            }
        });
    }

    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            hideAlerts();
            const fn = document.getElementById("fullName").value.trim();
            const u = document.getElementById("username").value.trim();
            const p = document.getElementById("password").value;
            const cp = document.getElementById("confirmPassword").value;
            try {
                await API.signup(fn, u, p, cp);
                showSuccess("Account created! Redirecting to login...");
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            } catch (err) {
                showError(err.message || "Sign up failed.");
            }
        });
    }

    const connectionBanner = document.getElementById("connection-banner");
    if (connectionBanner) {
        try {
            const ping = await API.ping();
            const dbInfo = ping.database
                ? ` · Database: <code>${ping.database}</code> (${ping.students_in_db} students)`
                : "";
            connectionBanner.innerHTML = `
                <strong>Server connected</strong> — IP: <code>${ping.client_ip}</code>
                · Time: <code>${ping.server_time}</code>${dbInfo}
            `;
            connectionBanner.classList.add("connection-ok");
        } catch {
            connectionBanner.textContent = "Could not reach the server. Check Wi-Fi and that Flask is running.";
            connectionBanner.classList.add("connection-error");
        }
    }

    const statTotal = document.getElementById("stat-total");
    if (statTotal) {
        try {
            const stats = await API.getStats();
            statTotal.textContent = stats.total;
            document.getElementById("stat-bsit").textContent = stats.bsit || 0;
            document.getElementById("stat-bsba").textContent = stats.bsba || 0;
            document.getElementById("stat-bshm").textContent = stats.bshm || 0;
            document.getElementById("stat-bstm").textContent = stats.bstm || 0;
        } catch (err) {
            showError(err.message || "Failed to load statistics.");
        }
    }

    const addStudentForm = document.getElementById("addStudentForm");
    if (addStudentForm) {
        addStudentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            hideAlerts();
            const student = {
                student_id: document.getElementById("student_id").value.trim(),
                full_name: document.getElementById("full_name").value.trim(),
                course: document.getElementById("course").value,
                year_level: document.getElementById("year_level").value,
                email: document.getElementById("email").value.trim(),
            };
            try {
                await API.addStudent(student);
                showSuccess("Student saved on the server successfully!");
                addStudentForm.reset();
            } catch (err) {
                showError(err.message || "Could not save student.");
            }
        });
    }

    function renderStudents(students, tbodyId) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        tbody.innerHTML = "";
        if (!students.length) {
            tbody.innerHTML =
                '<tr><td colspan="6" class="text-center">No students found</td></tr>';
            return;
        }
        students.forEach((s) => {
            const tr = document.createElement("tr");
            const sid = String(s.student_id).replace(/'/g, "\\'");
            tr.innerHTML = `
                <td>${s.student_id}</td>
                <td>${s.full_name}</td>
                <td>${s.course}</td>
                <td>Year ${s.year_level}</td>
                <td>${s.email}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-delete" data-id="${s.student_id}">Delete</button>
                </td>
            `;
            tr.querySelector(".btn-delete").addEventListener("click", () => deleteStudent(s.student_id));
            tbody.appendChild(tr);
        });
    }

    async function deleteStudent(id) {
        if (!confirm("Are you sure you want to delete this student?")) return;
        try {
            await API.deleteStudent(id);
            alert("Student deleted on the server.");
            await loadStudentTable();
        } catch (err) {
            alert(err.message || "Delete failed.");
        }
    }

    async function loadStudentTable(searchTerm) {
        const tbodyId = "student-table-body";
        if (!document.getElementById(tbodyId)) return;
        try {
            const data = await API.getStudents(searchTerm || "");
            renderStudents(data.students, tbodyId);
            const countDisplay = document.getElementById("total-students-count");
            if (countDisplay) countDisplay.textContent = data.count;
        } catch (err) {
            showError(err.message || "Failed to load students.");
        }
    }

    if (document.getElementById("student-table-body")) {
        await loadStudentTable();
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            let debounce;
            searchInput.addEventListener("input", () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => loadStudentTable(searchInput.value.trim()), 300);
            });
        }
    }
});
