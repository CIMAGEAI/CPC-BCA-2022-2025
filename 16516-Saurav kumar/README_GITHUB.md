# 🚨 Crime Report Portal

A modern Django-based crime reporting system with a Bootstrap frontend.

## Features
- Secure user authentication (admin, officer, supervisor, citizen)
- Anonymous crime reporting
- Evidence upload (file, photo, video)
- Officer dashboard with live notifications
- Case status tracking and comments
- Export reports (CSV, Excel, PDF)
- Real-time statistics and analytics
- Responsive, mobile-friendly UI

## Quick Start

```bash
git clone <your-repo-url>
cd <repo-folder>
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp env.example .env  # Edit .env for your config
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

- Visit [http://localhost:8000](http://localhost:8000)

## Project Structure

- `backend/` - Django apps (authentication, reports, notifications, etc.)
- `frontend/` - Templates and static files (CSS, JS, images)
- `manage.py` - Django management script
- `requirements.txt` - Python dependencies

## Contributing

1. Fork this repo
2. Create a feature branch
3. Make your changes with clear commits
4. Add/modify tests as needed
5. Open a pull request

## License
MIT

---
For full documentation, see the main `README.md` in the repo. 