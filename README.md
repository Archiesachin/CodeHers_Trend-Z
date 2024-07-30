# Trend-Z
Welcome to Trendz, an app designed specifically for Gen Z to keep up with the latest fashion trends. 

#### 1. Personalized Recommendations
 - When users sign onto our platform for the first time, they type their interests.
 - These interests are stored in the Firebase database and passed to the Flask server.
 - The Flask server scrapes Myntra’s website to recommend products based on those interests displayed on the home screen.

#### 2. Core Quiz
 - Users take the “Core Quiz” on the home screen to determine their fashion aesthetic through a set of choices.
 - Based on the classified categories, products that match their aesthetic are recommended using Python and Flask.

#### 3. fwdSnaps
 - Users can view other people’s fwdSnaps, a built-in Snapchat-like feature, and shop products shared in them.
 - They receive a daily notification at a random time via React Native and Expo Notification, reminding them to upload a snap of their outfit of the day (OOTD) to gain Fwd Snap Points and maintain a FWD Snap Streak.
 - This offers discounts and incentives to ensure users engage with the app daily.
 - Snaps can be uploaded to their story, stored locally on their device, or shared in virtual chatrooms.


#### 4. Virtual Chatrooms
 - Users can connect with others through in-built virtual chatrooms built using React Native and Expo.
 - Utilizing Firebase for the database, these chatrooms allow users to chat and share images, gather opinions, and foster a sense of community, enhancing user engagement.


#### 5. Daily Fashion Trends
 - Users are shown daily fashion trends scraped from Instagram every day at 12:00 AM using Python scheduling and Rapid API.
 - Products aligning with popular hashtags are fetched from fashion stores using Selenium with Chrome and Edge Drivers, and this data is stored in a SQLite Database to ensure users see the most updated trends and products daily.

#### 6. Virtual Try-On
 - Users can try on products virtually by taking a picture of themselves using our built-in virtual try-on feature.
 - This allows them to visualize how products would look on their body, leveraging an advanced external Stable Diffusion model integrated with Gradio, Hugging Face, and a Flask server.
 - This feature offers a convenient shopping experience, enabling users to try on clothes from the comfort of their homes before making a purchase.

#### 7. Snap Score and Discounts
 - Users can check their cart and view their Snap Score from their profile page.
 - They can redeem discounts calculated using a Weighted Multivariable Discount Model.
 - This model applies weights to their Snap Score, location, cohort, purchase amount, and engagement, utilizing Python and Firebase.

### Tech We used:
##### Trend Scraping and Analysis
 - APIs & Data Processing: Rapid API, Python, JSON, HTTP Client
 - Automation & Scraping: Selenium, ChromeDriver, and EdgeDriver
  - Data Handling: Pandas, NumPy, SQLite

##### App Development
 - Backend & Database: Flask, Firebase
 - Frontend & Mobile: React Native, Expo, Gradio

##### Building and Testing
 - Platforms: Jupyter Notebook, VSCode, Postman
 - Languages: Python, JavaScript


Made by CodeHers, 2024.
[Archie](https://github.com/Archiesachin) ,[Nidhi](https://github.com/nidhik5) and [Meetali](https://github.com/meetalik8)!
