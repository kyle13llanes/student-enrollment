// api.js — HTTP client for Flask REST API (client ↔ server)

const API = {
    async request(path, options = {}) {
        const config = {
            credentials: "same-origin",
            headers: { "Content-Type": "application/json", ...(options.headers || {}) },
            ...options,
        };
        if (config.body && typeof config.body === "object") {
            config.body = JSON.stringify(config.body);
        }
        const res = await fetch(path, config);
        let data = null;
        try {
            data = await res.json();
        } catch {
            data = null;
        }
        if (!res.ok) {
            const err = new Error((data && data.error) || res.statusText || "Request failed");
            err.status = res.status;
            err.data = data;
            throw err;
        }
        return data;
    },

    ping() {
        return this.request("/api/ping");
    },

    getSession() {
        return this.request("/api/auth/session");
    },

    login(username, password) {
        return this.request("/api/auth/login", {
            method: "POST",
            body: { username, password },
        });
    },

    signup(full_name, username, password, confirm_password) {
        return this.request("/api/auth/signup", {
            method: "POST",
            body: { full_name, username, password, confirm_password },
        });
    },

    logout() {
        return this.request("/api/auth/logout", { method: "POST" });
    },

    getStats() {
        return this.request("/api/stats");
    },

    getStudents(q) {
        const qs = q ? `?q=${encodeURIComponent(q)}` : "";
        return this.request(`/api/students${qs}`);
    },

    addStudent(student) {
        return this.request("/api/students", { method: "POST", body: student });
    },

    deleteStudent(studentId) {
        return this.request(`/api/students/${encodeURIComponent(studentId)}`, {
            method: "DELETE",
        });
    },
};
