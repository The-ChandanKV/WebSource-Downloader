import os
import shutil
import zipfile
import requests
import mimetypes
import tempfile
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

def sanitize_name(url):
    """Sanitizes a URL into a valid folder/file name."""
    domain = urlparse(url).netloc
    return "".join(c for c in domain if c.isalnum() or c in ('-', '_')).rstrip()

def download_asset(session, url, save_path):
    """Downloads a single asset and saves it."""
    try:
        response = session.get(url, timeout=10, stream=True)
        response.raise_for_status()
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except requests.exceptions.RequestException as e:
        print(f"Failed to download {url}: {e}")
        return False

def scrape_website(url: str):
    """The main function to scrape a website, including pages with paths."""
    project_name = sanitize_name(url)
    # Use a secure, unique temporary directory for each request
    project_path = tempfile.mkdtemp(prefix=project_name)

    paths = {
        "root": project_path,
        "css": os.path.join(project_path, "css"),
        "js": os.path.join(project_path, "js"),
        "images": os.path.join(project_path, "images"),
        "fonts": os.path.join(project_path, "fonts"),
        "others": os.path.join(project_path, "assets"),
    }
    for path in paths.values():
        os.makedirs(path, exist_ok=True)

    # Use a session object for connection pooling
    with requests.Session() as session:
        session.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'})

        try:
            # 1. Get the main HTML page
            response = session.get(url, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            # 2. Find, download, and rewrite asset links
            asset_tags = {
                'link': 'href',
                'script': 'src',
                'img': 'src',
            }

            for tag_name, attr in asset_tags.items():
                for tag in soup.find_all(tag_name):
                    asset_rel_path = tag.get(attr)
                    if not asset_rel_path or asset_rel_path.startswith(('data:', '#')):
                        continue

                    # Create a full, absolute URL for the asset. This correctly handles base URLs with paths.
                    asset_abs_url = urljoin(url, asset_rel_path)

                    # Skip assets from different domains
                    if urlparse(asset_abs_url).netloc != urlparse(url).netloc:
                        continue
                    
                    filename = os.path.basename(urlparse(asset_abs_url).path)
                    if not filename:
                        continue # Skip if no valid filename

                    # Determine asset type to save in the correct folder
                    content_type, _ = mimetypes.guess_type(filename)
                    save_dir = paths['others'] # Default directory
                    rel_dir = "assets"
                    if content_type:
                        if 'css' in content_type: save_dir, rel_dir = paths['css'], 'css'
                        elif 'javascript' in content_type: save_dir, rel_dir = paths['js'], 'js'
                        elif 'image' in content_type: save_dir, rel_dir = paths['images'], 'images'
                        elif 'font' in content_type: save_dir, rel_dir = paths['fonts'], 'fonts'

                    # Download the asset
                    save_path = os.path.join(save_dir, filename)
                    if download_asset(session, asset_abs_url, save_path):
                        # If download is successful, rewrite the HTML to point to the local file
                        tag[attr] = f"{rel_dir}/{filename}"
                    else:
                        # If download fails, remove the tag to avoid broken links
                        tag.decompose()
            
            # 3. Save the modified and beautified HTML
            with open(os.path.join(project_path, 'index.html'), 'w', encoding='utf-8') as f:
                f.write(soup.prettify())

            # 4. Zip the final directory
            zip_filename = f"{project_name}.zip"
            zip_path = os.path.join(tempfile.gettempdir(), zip_filename)
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for root, _, files in os.walk(project_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, project_path)
                        zipf.write(file_path, arcname)
            
            return zip_path
        finally:
            # 5. Clean up by removing the temporary directory
            shutil.rmtree(project_path)