import { useState } from 'react';

export default function ScraperForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDownloadUrl(null);
    try {
      const response = await fetch('http://localhost:8000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error('Failed to scrape website');
      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      setDownloadUrl(fileUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-8 bg-dark-light bg-opacity-80 rounded-2xl shadow-2xl p-10 backdrop-blur-lg border border-dark-light animate-fade-in"
        style={{ boxShadow: '0 8px 32px 0 rgba(229,9,20,0.25)' }}
      >
        <label className="text-2xl font-bold text-primary mb-2 text-center tracking-wide animate-fade-in">
          Scrape Any Website
        </label>
        <input
          type="url"
          placeholder="Enter website URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="transition-all duration-200 border-2 border-dark rounded-lg px-5 py-3 text-lg bg-dark-light text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/60 placeholder-gray-400 shadow-md animate-fade-in"
          required
        />
        <button
          type="submit"
          className="transition-all duration-200 bg-primary hover:bg-primary-dark text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-60 disabled:cursor-not-allowed animate-fade-in"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              Scraping...
            </span>
          ) : (
            'Scrape Website'
          )}
        </button>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download="website.zip"
            className="block w-full text-center mt-2 text-lg font-semibold text-primary underline hover:text-primary-dark transition animate-fade-in"
          >
            Download Website Zip
          </a>
        )}
        {error && <div className="mt-2 text-center text-red-500 animate-fade-in">{error}</div>}
      </form>
    </div>
  );
}
