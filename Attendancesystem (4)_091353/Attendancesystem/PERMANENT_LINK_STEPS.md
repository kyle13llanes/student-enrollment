# Permanent Public Link — Step by Step (GitHub + Render)

Follow every step in order. Total time: about **20–30 minutes**.

Your permanent URL will look like:

**`https://student-enrollment.onrender.com`**

(Exact name may have extra characters, e.g. `student-enrollment-abc1.onrender.com`)

**Demo login after deploy:** `demo` / `demo123` → **View All** (12 students)

---

## PART 1 — Create a GitHub account (skip if you already have one)

1. Open **https://github.com**
2. Click **Sign up**
3. Verify your email
4. Remember your **username** (example: `johndoe`) — you need it below

---

## PART 2 — Create a new repository on GitHub

1. Log in to GitHub
2. Click the **+** (top right) → **New repository**
3. Fill in:
   - **Repository name:** `student-enrollment`
   - **Public** (selected)
   - **Do NOT** check "Add a README file"
   - **Do NOT** add .gitignore or license
4. Click **Create repository**
5. Leave the page open — you will see commands; we use our own below

---

## PART 3 — Upload your project from your laptop

### 3.1 Open PowerShell in the project folder

1. Press **Windows key**, type **PowerShell**, open it
2. Paste this line and press **Enter**:

```powershell
cd "c:\xampp\htdocs\Attendancesystem (4)_091353\Attendancesystem"
```

### 3.2 Set your GitHub username

Replace `YOUR_GITHUB_USERNAME` with your real username, then run:

```powershell
$GITHUB_USER = "YOUR_GITHUB_USERNAME"
```

Example: `$GITHUB_USER = "johndoe"`

### 3.3 Run these commands one by one

Copy each block, paste in PowerShell, press **Enter**. Wait for each to finish.

```powershell
git branch -M main
```

```powershell
git remote remove origin 2>$null; git remote add origin "https://github.com/$GITHUB_USER/student-enrollment.git"
```

```powershell
git push -u origin main
```

### 3.4 First-time GitHub login (if asked)

- A browser window may open → **Sign in to GitHub** → **Authorize**
- Or GitHub asks for username + **Personal Access Token** (not your normal password):
  1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
  2. **Generate new token (classic)** → check **repo** → Generate
  3. Copy the token and paste it when PowerShell asks for a password

### 3.5 Confirm upload worked

1. Refresh your GitHub repo page:  
   `https://github.com/YOUR_GITHUB_USERNAME/student-enrollment`
2. You should see files: `app.py`, `templates`, `static`, `render.yaml`, etc.

If `git push` failed, read the red error text and fix before Part 4.

---

## PART 4 — Deploy on Render (permanent URL)

### 4.1 Create Render account

1. Open **https://render.com**
2. Click **Get Started** or **Sign Up**
3. Choose **Sign up with GitHub** (easiest)
4. Allow Render to access your GitHub

### 4.2 Deploy with Blueprint

1. On Render dashboard, click **New +**
2. Click **Blueprint**
3. Find **student-enrollment** in the list → click **Connect**
4. Render shows resources from `render.yaml`:
   - Web service: **student-enrollment**
5. Click **Apply** (bottom right)
6. Wait **5–10 minutes**. Status should become **Live** (green)

### 4.3 Get your permanent URL

1. Click the web service name **student-enrollment**
2. At the top you see **URL**, e.g.  
   `https://student-enrollment-xxxx.onrender.com`
3. Click it to open the site
4. **Copy this URL** — submit this for your class

### 4.4 First visit may be slow

Free Render apps **sleep** after 15 minutes with no visitors. The first open can take **30–60 seconds**. Wait, then refresh.

---

## PART 5 — Test your live website

1. Open your Render URL in a browser
2. Log in:
   - Username: **demo**
   - Password: **demo123**
3. Open **View All** — you should see **12 students**
4. Optional: add a student on **Add Student**, refresh **View All** — proves database works

---

## PART 6 — What to submit

| Field | Your answer |
|-------|-------------|
| Website URL | `https://student-enrollment-xxxx.onrender.com` |
| Username | demo |
| Password | demo123 |
| Framework | Flask (Python) |
| Database | SQLite (with sample data; optional PostgreSQL on paid Render) |

---

## Troubleshooting

### `git push` rejected or "repository not found"

- Repo name must be exactly `student-enrollment`
- `$GITHUB_USER` must match your GitHub username
- Create the empty repo on GitHub first (Part 2)

### Render build failed

1. Render → your service → **Logs**
2. Common fix: ensure `app.py` is in the **root** of the repo (not inside another folder)
3. Click **Manual Deploy** → **Deploy latest commit**

### Website shows 502 or error

- Wait 2 minutes and refresh
- Check **Logs** on Render for Python errors

### Login works but no students

- Open URL → login → **View All**
- On Render **Logs**, look for database init errors
- **Manual Deploy** once more (seed runs when database is empty)

### Blank page or old HTML

- You must use the **Render URL**, not `index.html` from your PC folder

---

## Updating your site later

After you change code on your laptop:

```powershell
cd "c:\xampp\htdocs\Attendancesystem (4)_091353\Attendancesystem"
git add .
git commit -m "Update project"
git push
```

Render redeploys automatically in a few minutes.

---

## Quick command summary (copy-paste)

```powershell
cd "c:\xampp\htdocs\Attendancesystem (4)_091353\Attendancesystem"
$GITHUB_USER = "YOUR_GITHUB_USERNAME"
git branch -M main
git remote remove origin 2>$null; git remote add origin "https://github.com/$GITHUB_USER/student-enrollment.git"
git push -u origin main
```

Then: **Render.com** → **New +** → **Blueprint** → **student-enrollment** → **Apply**
