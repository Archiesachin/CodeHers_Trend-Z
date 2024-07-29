from flask import Flask, jsonify, request,send_file, session
import http.client
import json
from datetime import datetime, timedelta
from collections import Counter, defaultdict
import re
from collections import Counter
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
import time
from gradio_client import Client, handle_file
from PIL import Image
import secrets
import os
import csv
import sqlite3

secret_key = secrets.token_hex(16) 
app = Flask(__name__)
app.secret_key = secret_key
CORS(app)
print(app.secret_key)
sqlite_conn = sqlite3.connect('cache.db', check_same_thread=False)
cursor = sqlite_conn.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS cache (
        hashtag TEXT PRIMARY KEY,
        data TEXT
    )
""")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS trends_cache (
        hashtag TEXT PRIMARY KEY,
        data TEXT
    )
""")

client = Client("levihsu/OOTDiffusion")
# Establish connection to the API
conn = http.client.HTTPSConnection("instagram-scraper-api2.p.rapidapi.com")
# Set the headers including your API key
headers = {
    'x-rapidapi-key': "d2b9f0bae4msha4451d9c477cacdp1b46ccjsn11166d9c2630",
    'x-rapidapi-host': "instagram-scraper-api2.p.rapidapi.com"
}
# Define the list of hashtags and time range
hashtags_list = ["#fashion", "#trend", "#style", "#genz"]
input_hashtags = set(tag.lstrip('#') for tag in hashtags_list)  # Remove the '#' from input hashtags
one_month_ago = datetime.now() - timedelta(days=30)

# List of keywords related to fashion and clothing
fashion_keywords = ['fashion', 'clothing', 'apparel', 'outfit', 'dress', 'shirt', 'pants', 'jeans', 'skirt', 'shoes', 'accessories','tshirt']

# Function to request data for a specific hashtag
def fetch_hashtag_data(hashtag):
    conn.request("GET", f"/v1/hashtag?hashtag={hashtag}", headers=headers)
    res = conn.getresponse()
    data = res.read()
    decoded_data = data.decode("utf-8")
    return json.loads(decoded_data)

# Function to filter and sort posts by engagement
def get_trending_posts(posts, start_date):
    trending_posts = []
    for post in posts:
        caption_data = post.get('caption')
        if caption_data:  # Ensure caption_data is not None
            created_at = caption_data.get('created_at_utc', 0)
            created_date = datetime.utcfromtimestamp(created_at)
            if created_date >= start_date:
                trending_posts.append(post)
    # Sort posts by engagement metrics, for example, likes or comments
    trending_posts.sort(key=lambda x: x.get('like_count', 0), reverse=True)
    return trending_posts

# Function to extract hashtags from posts
def extract_hashtags(posts):
    hashtags = []
    for post in posts:
        caption_data = post.get('caption', {})
        if caption_data:  # Ensure caption_data is not None
            post_hashtags = [tag.lstrip('#') for tag in caption_data.get('hashtags', [])]  # Remove '#' from hashtags
            hashtags.extend([tag for tag in post_hashtags if tag not in input_hashtags and any(keyword in tag for keyword in fashion_keywords)])
    return hashtags

# Define a function to clean hashtags
def clean_hashtag(hashtag):
    cleaned = re.sub(r'[^a-zA-Z]', '', hashtag.lower())
    for keyword in fashion_keywords:
        keyword_index = cleaned.find(keyword)
        if keyword_index != -1:
            cleaned = cleaned[:keyword_index]
            break
    print(f"Original: {hashtag}, Cleaned: {cleaned}")  # Print the cleaned hashtags
    return cleaned

# Define a function to suggest hashtags
def suggest_hashtags(hashtags, num_hashtags=10):
    # Clean the hashtags
    cleaned_hashtags = [(clean_hashtag(hashtag), count) for hashtag, count in hashtags]

    # Count the occurrences of cleaned hashtags
    hashtag_counts = Counter([hashtag for hashtag, _ in cleaned_hashtags])

    # Define a scoring function based on data-driven heuristics
    def score_hashtag(hashtag, count):
        score = 0
        
        # Prioritize longer and more descriptive hashtags
        score += len(hashtag) * 0.6
        
        # Prioritize hashtags based on their frequency in the dataset
        score += count * 0.2
        
        # Prioritize hashtags that are more unique or distinctive
        score += 1 / hashtag_counts[hashtag]
        
        return score

    # Score and sort the hashtags based on the scoring function
    scored_hashtags = [(hashtag, count, score_hashtag(hashtag, count)) for hashtag, count in cleaned_hashtags]
    scored_hashtags.sort(key=lambda x: x[2], reverse=True)

    # Suggest the top-scored hashtags
    suggested_hashtags = [hashtag for hashtag, count, score in scored_hashtags[:num_hashtags]]

    return suggested_hashtags
def cache_data(hashtag, data):
    cursor.execute("INSERT OR REPLACE INTO cache (hashtag, data) VALUES (?, ?)", (hashtag, json.dumps(data)))
    sqlite_conn.commit()

def get_cached_data(hashtag):
    cursor.execute("SELECT data FROM cache WHERE hashtag = ?", (hashtag,))
    row = cursor.fetchone()
    if row:
        return json.loads(row[0])
    else:
        return None  

def cache_dataT(hashtag, data, table_name='trends_cache'):
    cursor.execute("INSERT OR REPLACE INTO {} (hashtag, data) VALUES (?, ?)".format(table_name), (hashtag, json.dumps(data)))
    sqlite_conn.commit()

def get_cached_trends_data(hashtag):
    cursor.execute("SELECT data FROM trends_cache WHERE hashtag = ?", (hashtag,))
    row = cursor.fetchone()
    if row:
        return json.loads(row[0])
    else:
        return None 

@app.route('/hashtags', methods=['GET'])
def suggest_hashtags_endpoint():
    # Initialize a dictionary to store hashtags for each category
    category_hashtags = defaultdict(Counter)

    for hashtag in hashtags_list:
        json_data = fetch_hashtag_data(hashtag.lstrip('#'))  

        # Check if 'items' key is present in the JSON response
        if 'data' in json_data and 'items' in json_data['data']:
            posts = json_data['data']['items']

            # Get trending posts from the last month
            trending_month_posts = get_trending_posts(posts, one_month_ago)

            # Extract all hashtags from the trending posts, excluding input hashtags and filtering for fashion-related hashtags
            all_hashtags = extract_hashtags(trending_month_posts)

            # Update the counter for the current category with the extracted hashtags
            category_hashtags[hashtag.lstrip('#')].update(all_hashtags)
        else:
            continue

    # Combine all fashion-related hashtags across categories
    all_fashion_hashtags = set().union(*[set(counter) for counter in category_hashtags.values()])

    # Get the top fashion-related hashtags by count
    top_fashion_hashtags = Counter(all_fashion_hashtags).most_common()

    top_fashion_hashtags= [list(s) for s in top_fashion_hashtags]

    lst=[]
    for i in range(len(top_fashion_hashtags)):
        if top_fashion_hashtags[i][0] not in fashion_keywords :
            lst.append(top_fashion_hashtags[i])

    hashtags = lst
    print(hashtags)
    suggested_hashtags = suggest_hashtags(hashtags, num_hashtags=10)
    df = pd.DataFrame(suggested_hashtags)
    csv_filename = 'hashtags.csv'
    df.to_csv(csv_filename, index=False)

    print(f"Data saved to {csv_filename}")
    return jsonify({"suggested_hashtags": suggested_hashtags})

# Endpoint to scrape products using hashtags
@app.route('/trends', methods=['POST'])
def scrape_products():
    data = request.json
    suggested_hashtags = data.get("hashtags", [])
    all_products = []

    # Initialize WebDriver
    options = Options()
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    # Define base URLs
    base_urls = [
        'https://www.getketch.com/search?q=',
        'https://littleboxindia.com/search?type=product&options%5Bprefix%5D=last&q='
    ]

    def scroll_page(scroll_attempts):
        for _ in range(scroll_attempts):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)

    for hashtag in suggested_hashtags:
        for base_url in base_urls:
            search_url = f'{base_url}{hashtag}'
            driver.get(search_url)

            try:
                if 'littleboxindia.com' in base_url:
                    # Wait for the product listings to load
                    wait = WebDriverWait(driver, 20)
                    wait.until(EC.presence_of_all_elements_located((By.XPATH, "//div[@class='innerer']")))

                    # Scroll to load more products
                   

                    # Find all product elements after scrolling
                    product_elements = driver.find_elements(By.XPATH, "//div[@class='innerer']")

                    for element in product_elements:
                        try:
                            product_name_element = element.find_element(By.XPATH, ".//div[@class='product-block__title']")
                            product_name = product_name_element.text.strip()
                            
                            product_url_element = element.find_element(By.XPATH, ".//a[@class='product-link']")
                            product_url = product_url_element.get_attribute('href')
                            
                            price_element = element.find_element(By.XPATH, ".//span[contains(@class, 'product-price__item')]")
                            product_price = price_element.text.strip()

                            # For the image URL
                            image_element = element.find_element(By.XPATH, ".//img[contains(@class, 'rimage__image')]")
                            image_url = image_element.get_attribute('src') or image_element.get_attribute('data-src')

                            if product_name and product_url and product_price and image_url:
                                all_products.append({
                                    'Hashtag': hashtag,
                                    'Product Name': product_name,
                                    'URL': product_url,
                                    'Price': product_price,
                                    'Image URL': image_url
                                })
                        except Exception as e:
                            print(f"Error extracting data for an element on littleboxindia.com: {e}")

                elif 'getketch.com' in base_url:
                    # Wait for the product listings to load
                    WebDriverWait(driver, 30).until(
                        EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'st-product')]"))
                    )
                    
                    # Scroll to load more products
                    scroll_page(1)
                    
                    # Find all product elements
                    product_elements = driver.find_elements(By.XPATH, "//div[contains(@class, 'st-product')]")
                    
                    for element in product_elements:
                        try:
                            name_element = element.find_element(By.XPATH, ".//p[contains(@class, 'st-title-inner')]")
                            product_name = name_element.text.strip()
                            
                            url_element = element.find_element(By.XPATH, ".//a[contains(@class, 'st-loop-product__link')]")
                            product_url = driver.execute_script("return arguments[0].href;", url_element)

                            image_url = None
                            image_xpaths = [
                                ".//img[@class='grid-view-item__image']",
                                ".//img[contains(@class, 'product-image')]",
                                ".//img[contains(@src, 'product')]"
                            ]
                            for xpath in image_xpaths:
                                try:
                                    image_element = element.find_element(By.XPATH, xpath)
                                    image_url = image_element.get_attribute('src') or image_element.get_attribute('data-src')
                                    if image_url:
                                        break
                                except:
                                    continue

                            price_xpaths = [
                                ".//span[contains(@class, 'price')]",
                                ".//div[contains(@class, 'st-price')]//span",
                                ".//span[contains(@class, 'font-bold')]"
                            ]
                            
                            price = None
                            for xpath in price_xpaths:
                                try:
                                    price_element = element.find_element(By.XPATH, xpath)
                                    price = price_element.text.strip()
                                    break
                                except:
                                    continue
                            
                            if product_name and product_url and price and image_url:
                                all_products.append({
                                    'hashtag': hashtag,
                                    'name': product_name,
                                    'url': product_url,
                                    'price': price,
                                    'image': image_url
                                })
                        except Exception as e:
                            print(f"Error extracting data for an element on getketch.com: {e}")

            except Exception as e:
                print(f"An error occurred while processing the hashtag #{hashtag} on {base_url}: {e}")

    driver.quit()
    df = pd.DataFrame(all_products)
    csv_filename = 'trends_data.csv'
    df.to_csv(csv_filename, index=False)

    print(f"Data saved to {csv_filename}")
    return jsonify({"products": all_products})

@app.route('/interest', methods=['POST'])
def scrape():
    print("Received request:", request.json)
    selected_tags = request.json.get('tags', [])
    if isinstance(selected_tags, str):
        selected_tags = [selected_tags]
    base_url = 'https://www.myntra.com/'
    all_products = []
    print("Selected tags:", selected_tags)

    def start_browser():
        options = webdriver.ChromeOptions()
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        return driver

    driver = start_browser()

    try:
        for tag in selected_tags:
            while True:
                try:
                    search_url = f'{base_url}{tag.replace(" ", "-")}'
                    driver.get(search_url)
                    WebDriverWait(driver, 20).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, 'li.product-base'))
                    )
                    product_listings = driver.find_elements(By.CSS_SELECTOR, 'li.product-base')

                    for product in product_listings:
                        try:
                            product_name = product.find_element(By.CSS_SELECTOR, 'h4.product-product').text
                            product_price = product.find_element(By.CSS_SELECTOR, 'div.product-price > span').text
                            product_url = product.find_element(By.CSS_SELECTOR, 'a').get_attribute('href')
                            product_image = product.find_element(By.CSS_SELECTOR, 'img').get_attribute('src')

                            all_products.append({
                                'hashtag': tag,
                                'name': product_name,
                                'price': product_price,
                                'url': product_url,
                                'image': product_image,
                            })
                        except Exception as e:
                            continue

                    time.sleep(5)
                    break

                except Exception as e:
                    if 'no such window' in str(e):
                        driver.quit()
                        driver = start_browser()
                    else:
                        break

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        driver.quit()

    df_combined = pd.DataFrame(all_products)
    df_combined.to_csv('combined_data.csv', index=False)

    return jsonify(all_products)

@app.route('/try-on', methods=['POST'])
def try_on():    
    try:
        # Fetch the garment image
        garm_img_url = request.json['garm_img_url']
        print("Received image URL:", garm_img_url)

        # Process the image using OOTDiffusion
        result = client.predict(
            vton_img=handle_file('https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/2e0cca23e744c036b3905c4b6167371632942e1c/model_1.png'),
            garm_img=handle_file(garm_img_url),
            n_samples=1,
            n_steps=20,
            image_scale=2,
            seed=-1,
            api_name="/process_hd"
        )
        print("Processing result:", result)
        image_path = result[0]['image']
        with open('image_paths.csv', 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow([image_path])
        image_filename = os.path.basename(image_path)
        image_url = f'/get_image/{image_filename}'
        session['result'] = result
        return jsonify({
            'success': True,
            'message': 'Image processed successfully!',
            'image_url': image_url
        }), 200
    except Exception as e:
        print(f"Server error: {str(e)}") 
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/get_image/<filename>')
def get_image(filename):
    # Read image path from CSV
    with open('image_paths.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if os.path.basename(row[0]) == filename:
                image_path = row[0]
                return send_file(image_path, mimetype='image/webp')
    return 'Image not found', 404

sqlite_conn.commit()

if __name__ == '__main__':
    app.run(debug=True)
