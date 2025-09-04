Welcome to Bite Express.

DB dependency - [Watch this to download sqlite db](https://www.youtube.com/watch?v=IhrqPOB77_8)

Node 22.18.0 is used for this project.

To clone this project from main branch and run it.
1. Go to the folder where you want to clone.
2. open command prompt (CMD).
3. paste this command -> git clone https://github.com/Shaik8708/BiteExpress.git -b main
4. type this command -> cd (click enter and you will go to bite express folder)
5. to open in vs code -> code . (click enter)
6. to run the backend server, open terminal -> cd (click enter and you will go to backend folder)
7. then install node modules -> npm i
8. then run the server -> npx nodemon server.js
9. to run UI firstly install live server extension in vs code.
10. goto frontend folder and find index.html file and run with live server.
11. start exploring from customer perspective here - http://127.0.0.1:5500/frontend/login.html
12. start exploring from admin perspective here - http://127.0.0.1:5500/frontend/admin-login.html

Customer URLs
1. home page - http://127.0.0.1:5500/frontend/index.html - landing page
2. menu page - http://127.0.0.1:5500/frontend/shop.html - menu items is listed here and you can add them to cart
3. services page - http://127.0.0.1:5500/frontend/shop.html (same menu page) - menu items is listed here and you can add them to cart
4. my orders page - http://127.0.0.1:5500/frontend/orders.html - my orders are listed here (feedback can be added once the order is completed)
5. profile page - http://127.0.0.1:5500/frontend/profile.html - my profile page
6. cart page - http://127.0.0.1:5500/frontend/cart.html - list of items added to cart (coupon "SAVE10" can be used to get 10% off) and place order
7. login - http://127.0.0.1:5500/frontend/login.html - user login page
8. register - http://127.0.0.1:5500/frontend/register.html - user register page

Admin URLs 
1. dashboard page - http://127.0.0.1:5500/frontend/admin-dashboard.html - admin dashboard page
2. products page - http://127.0.0.1:5500/frontend/admin-products.html - admin products page where admin can ADD, UPDATE, VIEW and DELETE the products (Image of product should be added as URL of that image)
3. orders page - http://127.0.0.1:5500/frontend/admin-orders.html - orders page where admin can view all orders and complete or cancel the order and also view feedbacks
4. admin login - http://127.0.0.1:5500/frontend/admin-login.html - admin login page (username - admin, password - 12345)
