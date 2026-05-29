# Public Website URL — Two Options

Your project must be **working**, **accessible**, and **publicly viewable**. Use one of these:

---

## Option 1 — Instant public URL (about 2 minutes)

Best for: quick demo, submission deadline today.

1. Double-click **`get_public_url.bat`**
2. Wait until you see a line like:
   ```
   your url is: https://something-random.loca.lt
   ```
3. **Copy that `https://...` link** — that is your public website URL.
4. Keep **both** command windows open (Flask + tunnel).

**Login:** `demo` / `demo123` → **View All** (12 students in database)

**If the browser shows a LocalTunnel warning page:** click **Click to Continue** (or enter your public IP shown on that page — find it at https://ipv4.icanhazip.com).

**Note:** This URL changes each time you run the bat file. It stops when you close the windows.

---

## Option 2 — Permanent public URL (Render.com, free)

Best for: URL that stays the same for weeks (class project, portfolio).

### A. Upload to GitHub

1. Create account: https://github.com
2. Create new repository: `student-enrollment` (Public)
3. In PowerShell:

```powershell
cd "c:\xampp\htdocs\Attendancesystem (4)_091353\Attendancesystem"
git init
git add .
git commit -m "Student enrollment Flask app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/student-enrollment.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your GitHub username.)

### B. Deploy on Render

1. https://render.com → Sign up (free) → connect GitHub
2. **New +** → **Blueprint**
3. Select your `student-enrollment` repo
4. Click **Apply** → wait until **Live** (~5 min)

Your permanent URL:

`https://student-enrollment.onrender.com`  
(exact name may vary slightly)

**Login:** `demo` / `demo123`

First visit after idle may take 30–60 seconds (free tier wakes up).

---

## What to submit for class

| Requirement | What to submit |
|-------------|----------------|
| Working URL | `https://....loca.lt` (Option 1) or `https://....onrender.com` (Option 2) |
| Database | 12 sample students visible after login → View All |
| Demo account | demo / demo123 |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Tunnel URL not loading | Run `run.bat` first, then `get_public_url.bat` |
| Login fails on public URL | Use `demo` / `demo123` exactly |
| Render build fails | Ensure `app.py` is in the **root** of the GitHub repo |
| Empty student list online | Redeploy on Render; seed runs when database is new |
