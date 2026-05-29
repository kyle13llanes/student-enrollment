# Flask Client–Server Demo Guide

## Architecture

| Role | Device | Responsibility |
|------|--------|----------------|
| **Server (host)** | Your laptop | Runs `app.py` (Flask), SQLite database, REST API |
| **Client** | Your mobile phone | Browser loads pages and calls `/api/*` over Wi-Fi |

```
Phone browser  --HTTP-->  Laptop (Flask :5000)  --SQLite-->  data/enrollment.db
```

## Quick start

1. Install [Python 3](https://www.python.org/downloads/) (check **Add to PATH**).
2. Connect **laptop and phone to the same Wi-Fi** (or use laptop mobile hotspot).
3. Double-click **`run.bat`** or run:
   ```bash
   cd Attendancesystem
   pip install -r requirements.txt
   python app.py
   ```
4. Note the URL printed for your phone, e.g. `http://192.168.1.10:5000`.
5. On your phone, open that URL in Chrome/Safari.

**Demo login:** `admin` / `password`

## Presentation demo script

1. **Start server** on laptop — terminal shows LAN URL.
2. **On phone** — open `http://<LAN-IP>:5000` (not `localhost`).
3. **Login** — session is stored on the **server** (Flask session cookie).
4. **Dashboard** — green banner shows:
   - Your phone’s IP (`client_ip` from server)
   - Server time (proves live API call to `/api/ping`)
5. **Add a student** on the phone — data is saved in SQLite on the laptop.
6. **On laptop** — open the same URL in a browser, login, **View All** — same records (shared server database).
7. **Optional proof** — on laptop terminal, Flask logs each `POST /api/students` from the phone’s IP.

## API endpoints (client ↔ server)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/ping` | Connection test (IP + server time) |
| GET | `/api/auth/session` | Check login state |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/stats` | Dashboard counts |
| GET | `/api/students?q=` | List / search students |
| POST | `/api/students` | Add student |
| DELETE | `/api/students/<id>` | Delete student |

## Troubleshooting

### Phone cannot connect

- Use the **LAN IP** from the terminal, not `127.0.0.1`.
- Same network: phone Wi-Fi must match laptop (not guest/isolated Wi-Fi).
- **Windows Firewall:** allow Python on Private networks when prompted.
- Hotspot: enable hotspot on laptop, connect phone to it, use the hotspot gateway IP if needed.

### Find laptop IP manually (Windows)

```powershell
ipconfig
```

Look for **IPv4 Address** under your Wi-Fi adapter (e.g. `192.168.1.10`).

### Port in use

```bash
set PORT=8080
python app.py
```

Then use `http://<LAN-IP>:8080` on the phone.

## Project layout (Flask)

```
Attendancesystem/
├── app.py              # Flask server + API
├── requirements.txt
├── run.bat
├── data/               # SQLite (created on first run)
├── templates/          # HTML pages
└── static/
    ├── styles.css
    ├── api.js          # fetch() client for API
    └── script.js       # UI logic
```

Legacy static HTML files (`index.html`, `store.js`) in the root folder are no longer used when running Flask; use **`python app.py`** instead of opening HTML files directly.
