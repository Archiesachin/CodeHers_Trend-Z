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
import schedule

secret_key = secrets.token_hex(16) 
app = Flask(__name__)
app.secret_key = secret_key
CORS(app)
print(app.secret_key)
sqlite_conn = sqlite3.connect('data_cache.db', check_same_thread=False)
cursor = sqlite_conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS hashtags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hashtag TEXT UNIQUE,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
''')
cursor.execute('''
    CREATE TABLE IF NOT EXISTS trends_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hashtag TEXT,
        product_name TEXT,
        url TEXT,
        price TEXT,
        image_url TEXT,
        created_at DATETIME,
        FOREIGN KEY (hashtag) REFERENCES hashtags (hashtag)     
    )
''')


def run_suggest_hashtags_endpoint():
    print("Running suggest_hashtags_endpoint...")

schedule.every().day.at("00:00").do(run_suggest_hashtags_endpoint)


client = Client("levihsu/OOTDiffusion")

conn = http.client.HTTPSConnection("instagram-scraper-api2.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "d2b9f0bae4msha4451d9c477cacdp1b46ccjsn11166d9c2630",
    'x-rapidapi-host': "instagram-scraper-api2.p.rapidapi.com"
}

hashtags_list = ["#fashion", "#trend", "#style", "#genz"]
input_hashtags = set(tag.lstrip('#') for tag in hashtags_list)  
one_month_ago = datetime.now() - timedelta(days=30)

fashion_keywords = ['fashion', 'clothing', 'apparel', 'outfit', 'dress', 'shirt', 'pants', 'jeans', 'skirt', 'shoes', 'accessories','tshirt']


def fetch_hashtag_data(hashtag):
    conn.request("GET", f"/v1/hashtag?hashtag={hashtag}", headers=headers)
    res = conn.getresponse()
    data = res.read()
    decoded_data = data.decode("utf-8")
    return json.loads(decoded_data)

def get_trending_posts(posts, start_date):
    trending_posts = []
    for post in posts:
        caption_data = post.get('caption')
        if caption_data: 
            created_at = caption_data.get('created_at_utc', 0)
            created_date = datetime.utcfromtimestamp(created_at)
            if created_date >= start_date:
                trending_posts.append(post)
    trending_posts.sort(key=lambda x: x.get('like_count', 0), reverse=True)
    return trending_posts


def extract_hashtags(posts):
    hashtags = []
    for post in posts:
        caption_data = post.get('caption', {})
        if caption_data:  # Ensure caption_data is not None
            post_hashtags = [tag.lstrip('#') for tag in caption_data.get('hashtags', [])]  # Remove '#' from hashtags
            hashtags.extend([tag for tag in post_hashtags if tag not in input_hashtags and any(keyword in tag for keyword in fashion_keywords)])
    return hashtags

def clean_hashtag(hashtag):
    cleaned = re.sub(r'[^a-zA-Z]', '', hashtag.lower())
    for keyword in fashion_keywords:
        keyword_index = cleaned.find(keyword)
        if keyword_index != -1:
            cleaned = cleaned[:keyword_index]
            break
    print(f"Original: {hashtag}, Cleaned: {cleaned}")
    return cleaned

def suggest_hashtags(hashtags, num_hashtags=10):
    cleaned_hashtags = [(clean_hashtag(hashtag), count) for hashtag, count in hashtags]
    hashtag_counts = Counter([hashtag for hashtag, _ in cleaned_hashtags])
    def score_hashtag(hashtag, count):
        score = 0
        score += len(hashtag) * 0.6
        score += count * 0.2
        score += 1 / hashtag_counts[hashtag]
        return score
    scored_hashtags = [(hashtag, count, score_hashtag(hashtag, count)) for hashtag, count in cleaned_hashtags]
    scored_hashtags.sort(key=lambda x: x[2], reverse=True)
    suggested_hashtags = [hashtag for hashtag, count, score in scored_hashtags[:num_hashtags]]

    return suggested_hashtags

def cache_data(hashtag, data):
    cursor = sqlite_conn.cursor()
    try:
        cursor.execute(
            '''
            INSERT INTO hashtags (hashtag, data, created_at)
            VALUES (?, ?, ?)
            ''',
            (hashtag, json.dumps(data), datetime.now())
        )
        sqlite_conn.commit()
        print("Data cached successfully")
    except sqlite3.IntegrityError:
        cursor.execute(
            '''
            UPDATE hashtags
            SET data = ?, created_at = ?
            WHERE hashtag = ?
            ''',
            (json.dumps(data), datetime.now(), hashtag)
        )
        sqlite_conn.commit()
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        cursor.close()

def get_cached_data(hashtag):
    cursor = sqlite_conn.cursor()
    cursor.execute('''
        SELECT data
        FROM hashtags
        WHERE hashtag = ?
        ORDER BY created_at DESC
        LIMIT 1
    ''', (hashtag,))
    row = cursor.fetchone()
    cursor.close()
    if row:
        data= json.loads(row[0])
        return data.get('hashtags', [])
    else:
        return None

def get_cached_trends_data(hashtag):
    cursor = sqlite_conn.cursor()
    cursor.execute('''
        SELECT DISTINCT hashtag, product_name, url, price, image_url, created_at
        FROM trends_data
        WHERE hashtag = ?
        ORDER BY created_at DESC
        LIMIT 4
    ''', (hashtag,))
    rows = cursor.fetchall()
    cursor.close()
    data = [{
        'hashtag': row[0],
        'product_name': row[1],
        'url': row[2],
        'price': row[3],
        'image_url': row[4],
        'created_at': row[5]
    } for row in rows]
    
    return data

@app.route('/get-suggested-hashtags', methods=['GET'])
def get_suggested_hashtags():
    suggested_hashtags = get_cached_data('suggested_hashtags')
    if not suggested_hashtags:
        return jsonify({"error": "Hashtags not found in cache"}), 404
    return jsonify({"suggested_hashtags": suggested_hashtags})

@app.route('/get-trends-data', methods=['GET'])
def get_trends_data():
    suggested_hashtags = get_cached_data('suggested_hashtags')
    if not suggested_hashtags:
        return jsonify({"error": "Suggested hashtags not found in cache"}), 404
    trends_data = []
    for hashtag in suggested_hashtags:
        hashtag_trends = get_cached_trends_data(hashtag)
        trends_data.extend(hashtag_trends)
    
    if not trends_data:
        return jsonify({"error": "Trends data not found in cache"}), 404
    
    return jsonify({"products": trends_data})

@app.route('/hashtags', methods=['GET'])
def suggest_hashtags_endpoint():
    try:
        category_hashtags = defaultdict(Counter)

        for hashtag in hashtags_list:
            json_data = fetch_hashtag_data(hashtag.lstrip('#'))  

            if 'data' in json_data and 'items' in json_data['data']:
                posts = json_data['data']['items']
                trending_month_posts = get_trending_posts(posts, one_month_ago)
                all_hashtags = extract_hashtags(trending_month_posts)
                category_hashtags[hashtag.lstrip('#')].update(all_hashtags)
            else:
                continue

        all_fashion_hashtags = set().union(*[set(counter) for counter in category_hashtags.values()])
        top_fashion_hashtags = Counter(all_fashion_hashtags).most_common()
        top_fashion_hashtags= [list(s) for s in top_fashion_hashtags]

        lst=[]
        for i in range(len(top_fashion_hashtags)):
            if top_fashion_hashtags[i][0] not in fashion_keywords :
                lst.append(top_fashion_hashtags[i])

        hashtags = lst
        print(hashtags)
        suggested_hashtags = suggest_hashtags(hashtags, num_hashtags=10)
        cache_data('suggested_hashtags', {
            "hashtags": suggested_hashtags,
            "timestamp": datetime.now().isoformat()
        })
        df = pd.DataFrame(suggested_hashtags)
        csv_filename = 'hashtags.csv'
        df.to_csv(csv_filename, index=False)
        print(f"Data saved to {csv_filename}")
        return jsonify({"suggested_hashtags": suggested_hashtags})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/trends', methods=['POST'])
def scrape_products():
    suggested_hashtags = get_cached_data('suggested_hashtags')
    if not suggested_hashtags:
        return jsonify({"error": "Hashtags not found in cache"}), 404
    scraped_products = []

    options = Options()
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

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
                    wait = WebDriverWait(driver, 20)
                    wait.until(EC.presence_of_all_elements_located((By.XPATH, "//div[@class='innerer']")))
                    scroll_page(1)
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
                                scraped_products.append({
                                    'hashtag': hashtag,
                                    'name': product_name,
                                    'url': product_url,
                                    'price': product_price,
                                    'image': image_url
                                })
                        except Exception as e:
                            print(f"Error extracting data for an element on littleboxindia.com: {e}")

                elif 'getketch.com' in base_url:
                    WebDriverWait(driver, 30).until(
                        EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'st-product')]"))
                    )
                    scroll_page(1)
                
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
                                scraped_products.append({
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
    df = pd.DataFrame(scraped_products)
    cache_dataT('trends_data', scraped_products)
    csv_filename = 'trends_data.csv'
    df.to_csv(csv_filename, index=False)

    print(f"Data saved to {csv_filename}")
    return jsonify({"products": scraped_products})



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
        garm_img_url = request.json.get('garm_img_url')
        uploaded_img_url = request.json.get('uploaded_img_url')

        print("Received garment image URL:", garm_img_url)
        print("Received uploaded image URL:", uploaded_img_url)
        if not garm_img_url or not uploaded_img_url:
            raise ValueError("Both garment image URL and uploaded image URL are required.")
        # Process the image using OOTDiffusion
        result = client.predict(
            vton_img=handle_file(uploaded_img_url),
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
    with open('image_paths.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if os.path.basename(row[0]) == filename:
                image_path = row[0]
                return send_file(image_path, mimetype='image/webp')
    return 'Image not found', 404

cursor.close()
sqlite_conn.commit()

if __name__ == '__main__':
    app.run(debug=True)
