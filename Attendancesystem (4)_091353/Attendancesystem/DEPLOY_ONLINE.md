# Put Your Project Online (Free Public URL)

Your app uses a **real database** with **12 sample students** and **3 demo accounts**.

## Fastest way: Render.com (free)

### Step 1 — Put code on GitHub

1. Create a free account at [github.com](https://github.com)
2. Create a new repository (e.g. `student-enrollment`)
3. Upload the **`Attendancesystem`** folder contents (all files including `app.py`, `db.py`, `templates/`, `static/`, `render.yaml`)

### Step 2 — Deploy on Render

1. Go to [render.com](https://render.com) and sign up (free)
2. Click **New +** → **Blueprint**
3. Connect your GitHub repo
4. Render reads `render.yaml` and creates:
   - A **web service** (Flask app)
   - A **PostgreSQL database** (persistent data online)
5. Click **Apply** and wait ~5 minutes until status is **Live**

### Step 3 — Open your public site

Your URL will look like:

`https://student-enrollment-xxxx.onrender.com`

Share this link — anyone can open it in a browser (laptop or phone).

### Demo logins (pre-loaded in database)

| Username   | Password    |
|-----------|-------------|
| admin     | password    |
| demo      | demo123     |
| registrar | registrar1  |

After login, open **View All** to see 12 sample students in the database.

---

## Local database (on your laptop)

- File: `data/enrollment.db` (SQLite)
- Created when you run `run.bat` or `python app.py`
- Same sample users and students as online

To reset local data: delete `data/enrollment.db` and start the server again.

---

## Notes

- Free Render apps **sleep after ~15 min** of no use; first visit may take 30–60 seconds to wake up.
- Do not commit passwords to GitHub; production uses `FLASK_SECRET_KEY` from Render.
- For class demo on same Wi-Fi, you can still use `run.bat` and `http://192.168.x.x:5000` locally.

---

## Troubleshooting online deploy

| Problem | Fix |
|--------|-----|
| Build fails | Check `requirements.txt` is in repo root |
| 502 error | View **Logs** in Render dashboard |
| Empty student list | Redeploy once; seed runs when `students` table is empty |
| Login fails | Use exact demo credentials above |
