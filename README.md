# WebSource Downloader


A full-stack application to scrape and download a website's front-end assets (HTML, CSS, JS, images, fonts) as a zip file.

## 🚀 Features

- 🌐 Accepts a valid website link (e.g. https://example.com)
- 📦 Scrapes and downloads front-end code (HTML, CSS, JS, images, fonts)
- 🧱 Organizes assets into a clean project folder
- 🗜️ Generates a downloadable `.zip` of the folder
- 🎨 Aesthetic, modern, and responsive UI (with animations)
- ❌ Error handling for invalid URLs or blocked resources

---

## 🖥️ Tech Stack

| Layer      | Tools Used                                           |
|------------|------------------------------------------------------|
| Frontend   | React.js / Next.js, TailwindCSS                      |
| Backend    | Python (FastAPI / Flask) or Node.js (Express)        |
| Scraping   | wget / requests + BeautifulSoup / puppeteer          |
| Zipping    | Python `zipfile` module or Node `archiver` library   |

---

## 📁 Project Structure

```
WEB-SOURCE-DOWNLOADER/
├── backend/
│   ├── main.py              # Main FastAPI/Flask server logic
│   ├── scraper.py           # Web scraping logic (wget/requests/BS4)
│   ├── requirements.txt     # Python dependencies
│   └── temp_scrape.zip      # Temporary zip file for download (auto-generated)
│
├── frontend/
│   ├── .next/               # Next.js build folder
│   ├── components/
│   │   └── ScraperForm.js   # React component for URL input form
│   ├── node_modules/        # Frontend dependencies
│   ├── pages/
│   │   ├── _app.js          # Global App Component
│   │   └── index.js         # Main landing page with form
│   ├── public/
│   └── styles/
│       └── globals.css      # Tailwind global styles
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   └── tailwind.config.js
│
├── venv/                    # Python virtual environment
└── Readme.md
```

## Setup Instructions

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On Mac/Linux
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Usage
- Open your browser and go to `http://localhost:3000`.
- Enter the URL of the website you want to scrape.
- Click "Scrape Website".
- After processing, a download link for the zip file will appear.

---


**Note:** This tool is for educational/demo purposes. Some websites may block scraping or have complex asset loading that may not be fully captured.

**Note:** This tool is for educational/demo purposes. Some websites may block scraping or have complex asset loading that may not be fully captured.
