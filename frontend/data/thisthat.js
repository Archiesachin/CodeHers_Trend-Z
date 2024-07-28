const products = [
  {
      "image": "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/29155372/2024/6/28/950dec65-fac1-41d7-a1ea-7c1856d78a261719547113724-DressBerry-Barbiecore-Floral-Fantasy-Strappy-Midi-Dress-6181-2.jpg",
      "cores": "barbie",
      "url": "https://www.myntra.com/dresses/dressberry/dressberry-barbiecore-floral-fantasy-strappy-knee-length-dress/29155372/buy"
  },
  {
      "image": "https://littleboxindia.com/cdn/shop/files/f1d4802c9c39391020211dc1fb328304_540x.jpg?v=1719493846",
      "cores": "barbie",
      "url": "https://littleboxindia.com/products/tie-shoulder-layered-ruched-cami-dress-in-pink?variant=48871283360031&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&utm_campaign=gs-2022-04-12&utm_source=google&utm_medium=smart_campaign&gad_source=1&gclid=CjwKCAjwko21BhAPEiwAwfaQCBiV9emXbddgD0ZWbxw9wbBzZiBneBz_MT-2SNRIWpqB1P2_uXm1sRoCmiUQAvD_BwE"
  },
  {
      "image": "https://littleboxindia.com/cdn/shop/files/2f77895363ce1cbc0f1a48fc6a0d0e56_540x.jpg?v=1717341103",
      "cores": "barbie, cottage",
      "url": "https://littleboxindia.com/products/square-neck-on-and-off-shoulder-double-layer-short-sleeve-dress-in-white?variant=48739010248991&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&gad_source=1&gclid=CjwKCAjwko21BhAPEiwAwfaQCJZSQ4LjcJlWzQUpUkankwEyFBnwJ_LHnOPWapuNoYkkUCjNmGHiPxoCmW0QAvD_BwE"
  },
  {
      "image": "https://www.alamodelabel.in/cdn/shop/files/0D8A3EC3-5BEC-48D4-B8EB-F5AD7BAEB806_1200x.jpg?v=1717504219",
      "cores": "barbie",
      "url": "https://www.alamodelabel.in/products/summer-bubble-two-piece-set-in-pink"
  },
  {
      "image": "https://assets.newme.asia/wp-content/uploads/2024/07/191057066b84fb2c/NM-PRC-116-DRS-24-JUL-7395-LTPINK(1)-800x800.webp",
      "cores": "barbie",
      "url": "https://newme.asia/product/light-pink-solid-gathered-dress?gad_source=1&gclid=CjwKCAjwko21BhAPEiwAwfaQCOzBKEg3uTp2bj6QD7ddX4RbfrV1pGCQQ0GM-QNLZhKi7p_p9MAivhoCj4wQAvD_BwE&utm_campaign=Pf_max_feed_8sep&utm_medium=cpc&utm_source=google"
  },
  {
      "image": "https://lewkin.com/cdn/shop/files/001_Pink_4c9f06cc-d3de-4405-a5c3-0ad80ccd6159_1001x1360.jpg?v=1717983415",
      "cores": "barbie, corporate",
      "url": "https://lewkin.com/products/round-neck-short-sleeve-knit-top-ou411"
  },
  {
      "image": "https://littleboxindia.com/cdn/shop/files/27fa31f886034add53fdd992616192dd_540x.jpg?v=1719491230",
      "cores": "cottage,old academia",
      "url": "https://littleboxindia.com/products/ruths-ditsy-floral-square-neck-midi-dress?pr_prod_strat=e5_desc&pr_rec_id=8d7657198&pr_rec_pid=9334751002911&pr_ref_pid=9036987826463&pr_seq=uniform"
  },
  {
      "image": "https://littleboxindia.com/cdn/shop/products/f76524b51c632cb0241fe84a581bcc16_540x.jpg?v=1682951971",
      "cores": "cottage, street",
      "url": "https://littleboxindia.com/products/set-of-two-cottagecore-trending-corset-style-top-with-trouser?pr_prod_strat=e5_desc&pr_rec_id=29fe4fbd9&pr_rec_pid=8239017394463&pr_ref_pid=8250505756959&pr_seq=uniform"
  },
  {
      "image": "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/16588584/2023/5/22/0a0c278b-54a0-40fe-b6cb-5fe4b94564bd1684736643431STREET9WomenStunningBlueGeometricPolka-DottedDress2.jpg",
      "cores": "cottage, corporate",
      "url": "https://www.myntra.com/dresses/street+9/street-9-women-stunning-blue-geometric-polka-dotted-dress/16588584/buy"
  },
  {
      "image": "https://m.media-amazon.com/images/I/71cQQvptvkL._SY741_.jpg",
      "cores": "cottage",
      "url": "https://amzn.in/d/0i5HQZy6"
  },
  {
      "image": "https://lutaotie.com/cdn/shop/files/S65cd03f9ff8a48b0b54d2d93110a6f88w_404bcc8d-e50f-4768-953d-8a67031217f0_1024x1024.jpg?v=1715922428",
      "cores": "cottage, barbie",
      "url": "https://lutaotie.com/products/pink-summer-snowflakes-fairycore-cottagecore-princesscore-dress?variant=40814577254498"
  },
  {
      "image": "https://cdn.media.amplience.net/s/hottopic/31011158_hi?$productMainDesktop$&fmt=auto",
      "cores": "cottage, old academia",
      "url": "https://www.hottopic.com/product/social-collision-brown-plaid-long-sleeve-twofer-dress/31011166.html?cm_mmc=soc-_-pin-_-ads-_-dmy-_-feed-_-31011158&epik=dj0yJnU9dmFnVEJ4UVh5eUpYdzJ1MkFRd2RvYXdqdE5VajF6d1UmcD0wJm49cFZIWlEyQUU0cFd2TmtPUlYzN2Y3dyZ0PUFBQUFBR2FqWVZj"
  },
  {
      "image": "https://assets.newme.asia/wp-content/uploads/2024/05/23105107cb16dcdb/NM-PRC-84-BLS-24-MAY-5610-CHARCOAL(1)-876x1334.webp",
      "cores": "corporate, barbie",
      "url": "https://newme.asia/product/charcoal-grey-fitted-bow-top?gad_source=1&gclid=CjwKCAjwko21BhAPEiwAwfaQCOcNVpOYdVjAGzGQLMdhbZQ1H0kAm0vXhxwgyrANdPVXxpGxJKbTJhoCuz0QAvD_BwE"
  },
  {
      "image": "https://assets.newme.asia/wp-content/uploads/2024/01/11082909/NM-IN-55-BLS-24-JAN-1812-WHITE-4.webp",
      "cores": "corporate,street",
      "url": "https://newme.asia/product/white-vest-denim-top"
  },
  {
      "image": "https://i.etsystatic.com/32126672/r/il/a8b24e/4555504432/il_794xN.4555504432_8b5j.jpg",
      "cores": "corporate,barbie",
      "url": "https://www.etsy.com/listing/1401187305/women-luxury-2-piece-suit-womens-suit?epik=dj0yJnU9OHpQdXUyRVRyMWZLTVdwVUVGRzU4eEIxOC1yUjk5d20mcD0wJm49bWNXT1lIRmF4VVhBTnFiSUFVRi1pdyZ0PUFBQUFBR2FqWnZz"
  },
  {
      "image": "https://di2ponv0v5otw.cloudfront.net/posts/2024/01/16/65a6b11eeba4c4fdc57b6b12/m_wp_65a6b11ef8c5da5c760bf16b.webp",
      "cores": "corporate, old academia, cottage",
      "url": "https://poshmark.com/listing/Button-Front-Flare-Skirt-Without-Belt-65a6b11eeba4c4fdc57b6b12?utm_source=pin_unpaid&epik=dj0yJnU9TjEySUV1VHlXQTRFY3E4d0JjNDVEVFNBdTBrR2hUZWImcD0wJm49NHJHZ1ZpbVZjeGNwbUkzcjVXaGZSQSZ0PUFBQUFBR2FqWjhF"
  },
  {
      "image": "https://cdn.streetstylestore.com/2/4/2/2/6/9/242269-sss_vertical.webp",
      "cores": "corporate",
      "url": "https://streetstylestore.com/clothing/clothing-super-deals-517/set-of-3---blazer-with-waist-coat-trouser/97732?utm_source=google&utm_medium=cpc&utm_campaign=product-ads&gad_source=1&gclid=CjwKCAjwko21BhAPEiwAwfaQCN4bIWgEEqVT7UXdwhJ2oJLDUWCtvSRr_Nem7K8lzSDHZaP_wu2G4hoCNjoQAvD_BwE"
  },
  {
      "image": "https://images.meesho.com/images/products/273654477/udzgf_512.webp",
      "cores": "corporate",
      "url": "https://www.meesho.com/summer-office-wear-womens-coat-and-pant-set-professional-office-outfit-lightweight-summer-suit-breathable-workwear-ensemble-office-attire-for-hot-weather-stylish-office-coat-and-pant-cool-and-comfortable-work-outfit-trendy-summer-workwear-chic-office-wear-combo/p/4ixd59?utm_source=google&utm_medium=cpc&utm_campaign=gmc&srsltid=AfmBOorlePa4AltHzYcLa7oEeHMqQGoiUx9g0gG65f53H7S516Y8LOmsBAA"
  },
  {
      "image": "https://assets.newme.asia/wp-content/uploads/2023/10/28105415/NM-PRC-35-TSH-23-OCT-201-BROWN-1.webp",
      "cores": "street, academia",
      "url": "https://newme.asia/product/crew-neck-striped-street-style-tshirt"
  },
  {
      "image": "https://assets.newme.asia/wp-content/uploads/2024/05/23102802712afc55/NM-PRC-81-TSH-24-MAY-5707-LTGREEN(1).webp",
      "cores": "street, brat",
      "url": "https://newme.asia/product/light-green-color-block-cropped-shirt#fullScreenImg"
  },
  {
      "image": "https://littleboxindia.com/cdn/shop/products/03f7c12545d79e05539f065940e785b6_540x.jpg?v=1668436052",
      "cores": "street,cottage",
      "url": "https://littleboxindia.com/products/corset-style-trending-hoodie-style-top?variant=43774818255135&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&gad_source=1&gclid=CjwKCAjwko21BhAPEiwAwfaQCKM4_laZaDaPFwobFgYhW-OELcMV43wTS6__GImHE1Af_GttDbhnMhoCKHsQAvD_BwE"
  },
  {
      "image": "https://littleboxindia.com/cdn/shop/files/174_4_180x.jpg?v=1691762358",
      "cores": "street",
      "url": "https://littleboxindia.com/products/multipockets-style-drawstring-cargo-in-black?pr_prod_strat=jac&pr_rec_id=f97a8ba3b&pr_rec_pid=8469294514463&pr_ref_pid=8511239520543&pr_seq=uniform"
  },
  {
      "image": "https://freakins.com/cdn/shop/files/MyFreakins02482.jpg?v=1696419621&width=1000",
      "cores": "street,goth",
      "url": "https://freakins.com/products/gothic-chained-black-top?currency=INR&variant=42759849476257&utm_source=google&utm_medium=cpc&utm_campaign=Google%20Shopping&stkn=17bb703c0bed&utm_source=SHP_Google&utm_campaign=21392795994&utm_medium=&utm_content=&utm_term=&utm_source=google&utm_medium=paid&utm_campaign=21392795994&utm_content=&utm_term=&gadid=&gad_source=1&gclid=CjwKCAjwko21BhAPEiwAwfaQCHrKObIzaPuHDwHrcHr27xkJJiYI4zyy30LPt--JCfLU1NiaMzR5nxoCWR0QAvD_BwE"
  },
  {
      "image": "https://www.urbanmonkey.com/cdn/shop/files/black-shacket-ripstop-02_1024x.jpg?v=1711684468",
      "cores": "street",
      "url": "https://www.urbanmonkey.com/collections/shackets/products/ripstop-shacket-black?section_title=shackets&?section_id=469137031449&?location_id=6"
  },
  {
      "image": "https://m.media-amazon.com/images/I/71LEsy6dKhL._AC_SY445_.jpg",
      "cores": "brat,cottage",
      "url": "https://www.amazon.com/Ronny-Kobo-Womens-Jersey-X-Large/dp/B0CQSW987X?linkCode=ll1&tag=wwd0e2-20&linkId=7469b97367c64f4723e6b12be9d68f6f&language=en_US&ref_=as_li_ss_tl&asc_source=web&asc_campaign=web&asc_refurl=https%3A%2F%2Fwwd.com%2Fshop%2Fshop-fashion%2Fbrat-summer-style-1236495472%2F"
  },
  {
      "image": "https://n.nordstrommedia.com/id/sr3/11100ed4-39fc-4704-bab7-c1d697d0dc9a.jpeg?crop=pad&w=780&h=1196",
      "cores": "brat,street",
      "url": "https://www.nordstrom.com/s/zip-pocket-faux-leather-miniskirt/7683028?utm_channel=low_nd_affiliates_content&utm_content=&utm_term=256585&utm_source=impact&utm_medium=affiliate_content&utm_campaign=Penske%20Media%20Corporation&irclickid=XoMX0P2IpxyKU%3AQV9nXUTQbZUkC2t%3AWZqTAISM0&irgwc=1"
  },
  {
      "image": "https://i.etsystatic.com/52506803/r/il/c19bec/6110116255/il_794xN.6110116255_ft9h.jpg",
      "cores": "brat",
      "url": "https://www.etsy.com/listing/1733447790/brat-baby-tee-y2k-baby-tee-brat-shirt?zanpid=10690_1721986570_42fd39b641e2034d133bc166f4c7efaf&utm_medium=affiliate&utm_source=affiliate_window&utm_campaign=row_buyer&utm_content=78888&sv1=affiliate&sv_campaign_id=78888&sv_campaign_id=78888&sv_tax1=affiliate&sv_tax2=82275%7C749716&sv_tax3=Skimlinks&sv_tax4=refinery29.com&sv_affiliateId=78888&awc=10690_1721986570_42fd39b641e2034d133bc166f4c7efaf"
  },
  {
      "image": "https://www.westside.com/cdn/shop/files/300981895BLACK_4_de4b6440-4d79-46b3-9a9c-5c25ecd6f874.jpg?v=1721297099&width=1946",
      "cores": "brat,street",
      "url": "https://www.westside.com/collections/trending-now-western-wear-for-women/products/nuon-black-relaxed-fit-cargo-style-mid-rise-jeans-300981895"
  },
  {
      "image": "https://www.westside.com/cdn/shop/files/300980374BLACK_8.jpg?v=1721296832&width=493",
      "cores": "brat, goth, street",
      "url": "https://www.westside.com/collections/trending-now-western-wear-for-women/products/studiofit-black-ribbed-high-rise-skirt-300980374"
  },
  {
      "image": "https://m.media-amazon.com/images/I/61xrJq5nDiL._AC_SY445_.jpg",
      "cores": "brat",
      "url": "https://www.amazon.com/dp/B0CQLPMN9M?psc=1&pf_rd_p=8c2f9165-8e93-42a1-8313-73d3809141a2&pf_rd_r=RPSW97S9ZSN2KKAYHT8G&pd_rd_wg=aCiRf&pd_rd_w=PUEIO&content-id=amzn1.sym.8c2f9165-8e93-42a1-8313-73d3809141a2&pd_rd_r=3b2c4750-4eef-46df-b704-02b2223126ea&s=apparel&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw&linkCode=sl1&tag=beautyfas0013-20&linkId=8415d37a866668ee9ec312cd5affa610&language=en_US&ref_=as_li_ss_tl"
  }
]
export default products;