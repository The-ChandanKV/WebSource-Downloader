# WebSource Downloader


A full-stack application to scrape and download a website's front-end assets (HTML, CSS, JS, images, fonts) as a zip file.

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
