from flask import Flask, jsonify, request
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

@app.route('/scrape', methods=['POST'])
def scrape():
    selected_tags = request.json.get('tags', [])
    base_url = 'https://www.myntra.com/'
    all_products = []

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
                            product_name = product.find_element(By.CSS_SELECTOR, 'h3.product-brand').text
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

if __name__ == '__main__':
    app.run(debug=True)
