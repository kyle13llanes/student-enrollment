# Student Enrollment System

A complete student enrollment management system with login, signup, and student record management built with HTML, CSS, JavaScript, PHP, and MySQL.

## Features

- **User Authentication**
  - Secure login system
  - User registration/signup
  - Password hashing with bcrypt
  - Session management

- **Dashboard**
  - Student statistics by course
  - Add new students
  - View all students
  - Search student records
  - Delete student records
  - Responsive design

- **Security**
  - Password validation and hashing
  - SQL injection prevention using prepared statements
  - Session-based authentication
  - Email validation

## System Requirements

- PHP 7.0 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)
- Modern web browser

## Installation & Setup

### 1. Database Setup

1. Open phpMyAdmin or MySQL command line
2. Run the SQL commands from `database.sql`:
   ```sql
   -- Create Database
   CREATE DATABASE IF NOT EXISTS student_enrollment;
   USE student_enrollment;

   -- Run all queries from database.sql
   ```

3. Or import the `database.sql` file directly:
   - In phpMyAdmin: Select Import and choose database.sql
   - Or run: `mysql -u root -p < database.sql`

### 2. File Configuration

1. Update `config.php` with your database credentials:
   ```php
   $host = 'localhost';
   $dbname = 'student_enrollment';
   $username = 'root';  // Your MySQL username
   $password = '';      // Your MySQL password
   ```

### 3. File Structure

```
Attendancesystem/
├── index.php              # Login page
├── signup.php             # Registration page
├── dashboard.php          # Main enrollment system
├── logout.php             # Logout handler
├── config.php             # Database configuration
├── database.sql           # Database schema
├── styles.css             # Styling
├── script.js              # Frontend JavaScript
└── README.md              # This file
```

### 4. Server Setup

**Using Built-in PHP Server:**
```bash
cd Attendancesystem
php -S localhost:8000
```

Then navigate to: `http://localhost:8000`

**Using Apache (on Windows):**
1. Place folder in `C:\xampp\htdocs\Attendancesystem`
2. Navigate to: `http://localhost/Attendancesystem`

**Using Apache (on Linux/Mac):**
1. Place folder in `/var/www/html/Attendancesystem`
2. Navigate to: `http://localhost/Attendancesystem`

## Default Login Credentials

After running the database setup:
- **Username:** admin
- **Password:** admin123

> ⚠️ **Important:** Change the default password immediately after first login!

## File Descriptions

### `index.php`
Login page for existing users. Features:
- Username/password authentication
- Form validation
- Error handling
- Redirect to signup for new users

### `signup.php`
User registration page. Features:
- Create new user account
- Password confirmation
- Email validation
- Duplicate username/email checking

### `dashboard.php`
Main enrollment system. Features:
- Statistics dashboard (student counts by course)
- Add new students
- View all students in table format
- Search functionality
- Delete students
- User welcome message

### `config.php`
Database connection configuration. Variables:
- `$host` - MySQL server address
- `$dbname` - Database name
- `$username` - MySQL username
- `$password` - MySQL password

### `styles.css`
Complete styling for the application:
- Authentication pages
- Dashboard layout
- Responsive design
- Animations and transitions

### `script.js`
Frontend JavaScript functionality:
- Form validation
- Password strength checking
- Alert auto-dismiss
- Event handlers

### `database.sql`
SQL database schema including:
- Users table (for login/signup)
- Students table (for enrollment records)
- Sample admin user

## Features & Usage

### Login Process
1. Enter username and password
2. Click "Login"
3. Redirects to dashboard on success

### Create New Account
1. Click "Sign up here" on login page
2. Fill in all required fields
3. Password must be at least 6 characters
4. Click "Create Account"
5. Automatically redirected to login

### Add Student
1. Fill in Student ID, Full Name, Course, Year Level, and Email
2. Click "Save Student"
3. Student appears in records table

### Search Student
1. Enter search term in Student Records search box
2. Click "Search"
3. Results filtered by name, ID, or email

### Delete Student
1. Click "Delete" button in the Action column
2. Confirm deletion
3. Student record removed

### Logout
1. Click "Logout" button in top right
2. Session ends, redirected to login page

## Course Options

- **BSIT** - Bachelor of Science in Information Technology
- **BSBA** - Bachelor of Science in Business Administration
- **BSHM** - Bachelor of Science in Hotel Management
- **BSTM** - Bachelor of Science in Tourism Management

## Security Features

- ✅ Passwords hashed using bcrypt (PASSWORD_BCRYPT)
- ✅ SQL injection prevention with prepared statements
- ✅ Session-based authentication
- ✅ Input validation and sanitization
- ✅ Email validation
- ✅ Unique constraints on username and email

## Troubleshooting

### "Connection failed" error
- Check if MySQL is running
- Verify credentials in `config.php`
- Ensure database `student_enrollment` exists

### "Database does not exist" error
- Run the SQL commands from `database.sql`
- Check that MySQL user has CREATE DATABASE privileges

### Form not submitting
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Ensure file permissions allow PHP execution

### Session not persisting
- Verify PHP session settings are configured
- Check that cookies are enabled in browser
- Ensure `/tmp` directory exists (Linux/Mac)

## Database Schema

### Users Table
```
user_id (INT, PRIMARY KEY, AUTO_INCREMENT)
username (VARCHAR, UNIQUE)
email (VARCHAR, UNIQUE)
password (VARCHAR)
full_name (VARCHAR)
user_type (ENUM: 'admin', 'user')
created_at (TIMESTAMP)
```

### Students Table
```
student_id (VARCHAR, PRIMARY KEY)
full_name (VARCHAR)
email (VARCHAR, UNIQUE)
course (VARCHAR)
year_level (INT)
user_id (INT, FOREIGN KEY)
created_at (TIMESTAMP)
```

## Future Enhancements

- [ ] Edit student records
- [ ] Export data to Excel/PDF
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] User roles and permissions
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Attendance tracking

## Support

For issues or questions, please check the database configuration and ensure all files are properly placed in the directory.

---

**Version:** 1.0  
**Last Updated:** May 2026
