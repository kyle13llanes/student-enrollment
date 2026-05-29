# Quick Setup Guide

## Step 1: Prepare Your System

### On Windows with XAMPP:
1. Download and install XAMPP from https://www.apachefriends.org/
2. Start Apache and MySQL services
3. Open http://localhost/phpmyadmin

### On Windows with PHP Built-in Server:
1. Install PHP from https://www.php.net/downloads
2. Ensure MySQL is running
3. Open Command Prompt in the project folder

### On Linux/Mac:
1. Install PHP: `sudo apt-get install php php-mysql` (Linux)
2. Install MySQL: `sudo apt-get install mysql-server` (Linux)
3. On Mac, use Homebrew: `brew install php mysql`

## Step 2: Create Database

### Option A: Using phpMyAdmin (Easiest)
1. Go to http://localhost/phpmyadmin
2. Click "New" on left side
3. Database name: `student_enrollment`
4. Collation: `utf8_general_ci`
5. Click "Create"
6. Click on the new database
7. Go to "Import" tab
8. Select `database.sql` file
9. Click "Go"

### Option B: Using MySQL Command Line
1. Open MySQL Command Line (Start > MySQL Command Line Client)
2. Enter password if prompted
3. Copy and paste the contents of `database.sql`
4. Press Enter

### Option C: Command Line
```bash
mysql -u root -p < database.sql
```

## Step 3: Update Configuration

Edit `config.php`:

```php
$host = 'localhost';
$dbname = 'student_enrollment';
$username = 'root';        // Your MySQL username
$password = '';            // Your MySQL password (leave blank if none)
```

## Step 4: Run the Application

### On XAMPP:
1. Place the entire `Attendancesystem` folder in `C:\xampp\htdocs\`
2. Go to http://localhost/Attendancesystem
3. Login with: admin / admin123

### With PHP Built-in Server:
1. Open Command Prompt
2. Navigate to project folder: `cd Attendancesystem`
3. Run: `php -S localhost:8000`
4. Go to http://localhost:8000
5. Login with: admin / admin123

### On Linux/Mac:
1. Place folder in `/var/www/html/`
2. Set permissions: `sudo chmod -R 755 /var/www/html/Attendancesystem`
3. Go to http://localhost/Attendancesystem
4. Login with: admin / admin123

## Step 5: First Login

- **Username:** admin
- **Password:** admin123

> Change this password after first login!

## Testing Features

### 1. Test Login
- Use admin/admin123
- Should redirect to dashboard

### 2. Create New Account
- Click "Sign up here"
- Fill all fields
- Create account
- Login with new credentials

### 3. Add Students
- Click "Add Student" section
- Fill all fields
- Click "Save Student"
- Check if it appears in records table

### 4. Search Students
- Enter text in search box
- Click Search
- Should filter results

### 5. Delete Students
- Click Delete button on any student
- Confirm deletion
- Student should be removed

## Troubleshooting

### White Page / No Content
- Check PHP error log: `php -S localhost:8000` shows errors
- Verify database connection in `config.php`
- Check MySQL is running

### Cannot Connect to Database
```
Error: Connection failed: ...
```
- Check MySQL service is running
- Verify credentials in `config.php`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Login Page Shows but Dashboard is Blank
- Clear browser cache (Ctrl+Shift+Delete)
- Check PHP/MySQL logs
- Verify database tables exist

### Files Not Found
- Ensure all .php files are in the same folder
- Check file names are exact (case-sensitive on Linux)
- Verify you're accessing the correct URL

## File Checklist

Before running the application, verify you have:

- [ ] `index.php` - Login page
- [ ] `signup.php` - Registration
- [ ] `dashboard.php` - Main system
- [ ] `logout.php` - Logout handler
- [ ] `config.php` - Database config
- [ ] `styles.css` - Styling
- [ ] `script.js` - JavaScript
- [ ] `database.sql` - Database schema
- [ ] `README.md` - Documentation

## Default Admin Account

After database setup:
- **Username:** admin
- **Password:** admin123

## Next Steps

1. ✅ Setup database
2. ✅ Configure `config.php`
3. ✅ Start web server
4. ✅ Login to system
5. ✅ Create new user accounts
6. ✅ Add student records
7. ✅ Test search and delete

## Tips

- Make regular backups of your database
- Use strong passwords for user accounts
- Periodically review student records
- Test all features after setup

---

Need more help? Check README.md for detailed documentation.
