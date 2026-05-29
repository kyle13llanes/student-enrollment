// store.js - LocalStorage Wrapper for Student Enrollment System

const Store = {
    // Users
    getUsers: function() {
        return JSON.parse(localStorage.getItem('users')) || [];
    },
    saveUsers: function(users) {
        localStorage.setItem('users', JSON.stringify(users));
    },
    addUser: function(user) {
        const users = this.getUsers();
        user.user_id = Date.now();
        users.push(user);
        this.saveUsers(users);
    },
    getUser: function(username, password) {
        const users = this.getUsers();
        return users.find(u => u.username === username && u.password === password);
    },
    userExists: function(username) {
        const users = this.getUsers();
        return users.some(u => u.username === username);
    },

    // Session
    login: function(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    },
    logout: function() {
        sessionStorage.removeItem('currentUser');
    },
    getCurrentUser: function() {
        return JSON.parse(sessionStorage.getItem('currentUser'));
    },
    requireAuth: function() {
        if (!this.getCurrentUser()) {
            window.location.href = 'index.html';
        }
    },

    // Students
    getStudents: function() {
        return JSON.parse(localStorage.getItem('students')) || [];
    },
    saveStudents: function(students) {
        localStorage.setItem('students', JSON.stringify(students));
    },
    addStudent: function(student) {
        const students = this.getStudents();
        // Check for duplicate ID
        if (students.some(s => s.student_id === student.student_id)) {
            return false;
        }
        students.push(student);
        this.saveStudents(students);
        return true;
    },
    deleteStudent: function(id) {
        let students = this.getStudents();
        const initialLen = students.length;
        students = students.filter(s => s.student_id !== id);
        if (students.length < initialLen) {
            this.saveStudents(students);
            return true;
        }
        return false;
    },
    searchStudents: function(term) {
        const students = this.getStudents();
        const lowerTerm = term.toLowerCase();
        return students.filter(s => 
            s.student_id.toLowerCase().includes(lowerTerm) ||
            s.full_name.toLowerCase().includes(lowerTerm) ||
            s.email.toLowerCase().includes(lowerTerm)
        );
    },
    getStats: function() {
        const students = this.getStudents();
        const stats = { total: 0, bsit: 0, bsba: 0, bshm: 0, bstm: 0 };
        students.forEach(s => {
            stats.total++;
            const course = (s.course || '').toLowerCase();
            if (stats[course] !== undefined) {
                stats[course]++;
            }
        });
        return stats;
    },

    // Initialize with dummy data if empty
    init: function() {
        if (this.getUsers().length === 0) {
            this.addUser({
                username: 'admin',
                password: 'password', // in a real app, never store plain text passwords
                full_name: 'Administrator'
            });
        }
    }
};

Store.init();
