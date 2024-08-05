# Trend-Z
Welcome to Trendz, an app designed specifically for Gen Z to keep up with the latest fashion trends. 

## Table of Contents

- [Problem Statement](#problem-statement)
- [Features](#features)
- [Demo](#demo)
- [Technology Stack](#technology-stack)


## Problem Statement
Gen Z consumers are highly attuned to trends and fashion, often turning to platforms like Instagram to stay current with the latest in-the-moment styles. They desire immersive shopping experiences that replicate the feel of in-store shopping from the comfort of their homes. Additionally, Gen Z uses social media not only to connect with friends and family but also to find a sense of belonging among like-minded individuals who share their interests and values. They seek avenues to express themselves creatively and to experiment with different ways of being themselves.

To address these needs, we have selected the use cases of trend-centric recommendations and user engagement on the platform, aiming to provide personalized and engaging shopping experiences that resonate with Gen Z's preferences and behaviors.

## Features

#### 1. Personalized Recommendations
 In traditional fashion ecommerce platforms when a user signs in for the first time they are recommended products based on relevance and popularity, to personalize those recommendations Trendz asks the users about their interests when they sign in for the first time and then uses that to scrape myntra’s website in realtime and dynamically fetches the products on the home screen that caters to them.This ensures that their individuality is maintained and recommendations are personalized and up to date.


#### 2. Core Quiz
Cores is a GenZ slang term used to define fashion aesthetics and styles. For example, people who liked the fashion of the barbie movie, they define their fashion as barbie core or others who like corporate wear define it as corporate core. To improve product visibility and reach we added a quiz for users to choose different fashion aesthetics based on a series of questions, and then based on their answers they recommended products that fall into those categories. Users can retake the quiz any number of times to find new products and rediscover new fashion aesthetics.


#### 3. fwdSnaps
o enhance user engagement, we have introduced FwdSnap, inspired by popular social media apps like Snapchat and BeReal, which are used daily by 80% of Gen Z. Built from the ground up with unique features, FwdSnap sends a daily notification at a random time, reminding users to upload a snap and maintain their Fwd Snap Score. This score, reflecting consecutive days of story uploads, can be used for discounts and offers. Users can save snaps locally or share them in virtual chat rooms. Additionally, users can share liked products on their FwdSnap Story, including direct links for others to view, try on, and add to their cart, boosting product reach and sales.


#### 4. Virtual Chatrooms
 Virtual chat rooms are online fashion communities which connect users who share the same fashion interest. Users can easily join any community or create a new community to share content and updates relating to their fashion interests. They can engage in discussions based on their interests, share their style with their friends, collaborate on outfits, get instant feedback, which  makes shopping a truly social experience.


#### 5. Daily Fashion Trends

To recommend trending hashtags, we utilize Rapid API to scrape hashtags from keywords such as fashion, trends, and styles. Our approach is driven by the fact that Gen Z heavily relies on Instagram for discovering the latest trends. Therefore, we focus on Instagram posts from the last 30 days that have received the highest engagement, meaning those that were well-received by users.
We then apply a weighted scoring system to determine the most trending hashtags. This scoring takes into account factors such as length, count, and uniqueness. The top 10 most relevant hashtags are then suggested based on this analysis.
After obtaining these hashtags, they are used as search queries on various websites to retrieve top 4 products for them. The hashtags and products are automatically fetched everyday at 12 AM to ensure that the latest trends and products are displayed to the user.


#### 6. Virtual Try-On
Genz being a tech savvy generation likes to enjoy in store shopping like experience at the comfort of their home . By leveraging a stable diffusion model we have implemented a try on system for users to help them visualize the clothes on them before buying. The user takes a photo of themselves following the instructions given and then this image along with the product image are sent to the model and the output is obtained. Virtual try-ons make the product return rate less as users have a clear idea how it would look like on them without physically trying on the product.


#### 7. Snap Score and Discounts
 TrendZ not only makes the shopping experience fun but also rewarding. The users can see unlocked discounts on their profile page that are calculated based on various factors such as their engagement, fwdsnap points, past purchase amount and location using a Weighted Multivariable Discount Model. The model then shows the various discounts that the user can redeem with the top weighted factor for the resulted discount. 


## Demo

https://github.com/user-attachments/assets/19b102be-46fe-4980-b489-007aeae6175e


## Technology Stack

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


## Made by CodeHers, 2024.
[Archie](https://github.com/Archiesachin) ,[Nidhi](https://github.com/nidhik5) and [Meetali](https://github.com/meetalik8)!
