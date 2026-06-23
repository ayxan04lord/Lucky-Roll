# 🎲 Dice Roller

Full-stack dice rolling app — React (Vite + TypeScript) frontend, Django REST backend.

## Project Structure

```
├── frontend/   # Vite + React + TypeScript
└── backend/    # Django REST Framework
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver   # http://localhost:8000
```

## Features

- 🎲 D4 / D6 / D8 / D10 / D12 / D20 dice types
- 🔢 1–6 configurable dice count
- 🔒 Lock individual dice (Yahtzee-style)
- 🎯 Target total with win detection
- 🏆 Max score confetti animation
- 📜 Roll history (backend DB or localStorage offline)
- 📊 Stats: total rolls, best score, average, face frequency chart
- 🌙 Dark / Light theme
- 🔗 Shareable URL with dice config params
- ✅ Offline mode (works without backend)
