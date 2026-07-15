INSERT INTO product (id, category_id, name, description, created_date, last_modified_date, created_by, last_modified_by)
VALUES
    -- Laptops
    (1, 3, 'ASUS ROG Strix Scar 18', 'ASUS ROG Strix Scar AI Gaming Laptop 18" 240Hz Mini LED WQXGA Display (Intel Ultra 9-275HX, GeForce RTX 5080 16GB, DDR5, PCIe SSD, RGB KB, Win 11 Pro) w/USB-C Dock', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),
    (2, 3, 'Apple MacBook Air (13-inch)', '1.6GHz Dual-Core Intel Core i5, Intel UHD Graphics 617, 13" Retina Display, macOS', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),
    (3, 3, 'HP Omen Max (16-inch)', 'HP OMEN MAX Gaming Laptop, Intel Ultra 9-275HX, DDR5 RAM, PCIe SSD, 16" WUXGA (1920 x 1200) 165 Hz Display, Nvidia G-Force RTX 5090, 1-Zone RGB Backlit Keyboard, W11, Shadow Black', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),
    (4, 3, 'Microsoft Surface Pro 7', 'Microsoft Surface Pro 7 - 12.3" Touch-Screen - Intel Core i7 - 10th Gen 16GB Memory - 1TB SSD', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),
    (5, 3, 'MSI Vector HX 17', 'MSI Vector HX 17 in Gaming Laptop Intel Core i9-14900HX RTX 4090 64GB 2TB Win11PRO - Intel HM770 Chip - 2560 x 1600 - Windows 11 Pro - NVIDIA GeForce RTX 4090 with 16 GB - In-plane Switching (IPS) Tec', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),

    -- Smartphones
    (6, 4, 'Samsung Galaxy S21', 'Samsung Galaxy S21 5G, US Version, 128GB, Unlocked (Renewed)', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),
    (7, 4, 'Google Pixel 9', 'Google Pixel 9 - Unlocked Android Smartphone, 24-Hour Battery, Advanced Camera, and 6.3" Actua Display - 256 GB (Renewed) | Advanced Camera', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),
    (8, 4, 'Apple iPhone 17', 'Apple iPhone 17, US Version, 256GB, eSIM, Mist Blue- Unlocked (Renewed)', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),

    -- TV
    (9, 5, 'Samsung UN98DU9000 (98-inch) 4K Crystal UHD DU9000 (2024)', 'Samsung 98-Inch Class 4K Crystal UHD DU9000 Series HDR Smart TV, Object Tracking Sound Lite, Motion Xcelerator 120Hz, Supersize Picture Enhancer, Mega Contrast, Alexa Built-In (UN98DU9000, 2024 Model)', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),
    (10, 5, 'Sony BRAVIA 8 K65XR80C OLED 4K UHD Smart Google TV (Renewed)', 'Sony Class BRAVIA 8 OLED 4K UHD Smart Google TV - K65XR80C (Renewed)', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),
    (11, 5, 'Samsung QLED Q8F 4K UHD Smart TV (2025 Model)', 'Samsung QLED Q8F 4K UHD Smart TV (2025 Model) Q4 AI Processor, 100% Color Volume with Quantum Dot, AirSlim Design, Endless Free Content, Samsung Vision AI, Alexa Built-in', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),
    (12, 5, 'Samsung QLED Q7F 4K UHD Smart TV (2025 Model, 65Q7F)', 'Samsung QLED Q7F Series Samsung Vision AI Smart TV (2025 Model, 65Q7F) Quantum HDR, Object Tracking Sound Lite, Q4 AI Gen1 Processor, 4K upscaling, Gaming Hub, Alexa Built-in', NOW(), NULL, '1a5f3c8b-a60b-4dfd-a197-db6ae48e5cbc', NULL),

    -- T-Shirts
    (13, 7, 'ANRABESS Womens Tops Oversized T Shirts Short Sleeve Crewneck', 'ANRABESS Womens Tops Oversized T Shirts Short Sleeve Crewneck Summer Casual Loose Basic Tee Shirt 2026 Trendy Fashion Clothes', NOW(), NULL, '06861b37-7236-480d-af72-5319b174ee72', NULL),
    (14, 7, 'Runcati Mens Short Sleeve T-Shirts Casual Graphic Printed', 'Runcati Mens Short Sleeve T-Shirts Casual Graphic Printed Tee Tops Crewneck Summer Beach Hawaiian Vintage Shirt', NOW(), NULL, '06861b37-7236-480d-af72-5319b174ee72', NULL),

    -- Jeans
    (15, 8, 'Baggy Jeans for Men Y2K Streetwear Vintage Wide Leg Loose', 'Loose Fit: LuminBlaze baggy jeans feature a loose fit with relaxed thigh cut, comfortable, stylish and classic.', NOW(), NULL, '06861b37-7236-480d-af72-5319b174ee72', NULL),
    (16, 8, 'Sidefeel Women''s High Waisted Jeans Strechy Fashion Raw Hem Straight Leg Ankle Denim Pants with Pockets', 'Straight leg jeans feature a high waist and raw hem design, complemented by a two-button fly on the front, which prevents slipping and evenly distributes pressure, offering tummy control at the waist and creating a sleek and tidy waistline', NOW(), NULL, '06861b37-7236-480d-af72-5319b174ee72', NULL),

    -- Sport Shoes
    (17, 10, 'Padgene Womens Sneakers Air Cushion Running Shoes Lightweight Tennis Walking Shoes Mesh', '[Breathable Tennis Upper] - Crafted from lightweight and breathable materials, our tennis shoes feature a mesh upper that ensures complete breathability. Your feet will experience exceptional comfort and flexibility, as these athletic shoes are designed with your comfort in mind.', NOW(), NULL, '06861b37-7236-480d-af72-5319b174ee72', NULL),
    (18, 10, 'Mens Running Shoes Tennis Sneakers Slip on Walking Gym Non Slip Work Shoe Lightweight', '[Excellent Breathability] Mens tennis shoes made with breathable mesh material provide excellent breathability and flexibility, keeping long-lasting dryness and comfort even during high-intensity exercise.', NOW(), NULL, '06861b37-7236-480d-af72-5319b174ee72', NULL),

    -- Elegant Shoes
    (19, 11, 'mysoft Women''s High Heels Pumps Closed Pointed Toe Stiletto 4IN Heels Dress Wedding Shoes', 'These pointed toe pumps can be paired with everything in your wardrobe, including T-shirts, jeans, suits, dresses, and more. There are a variety of colors for you to choose to meet your different needs.', NOW(), NULL, '06861b37-7236-480d-af72-5319b174ee72', NULL),
    (20, 11, 'Clarks Men''s Tilden Cap Oxford Shoe', 'Comfort Features: Ortholite Footbed, Smooth Fabric and PU Linings, Durable TPR Outsole', NOW(), NULL, '06861b37-7236-480d-af72-5319b174ee72', NULL),

    -- Puzzles
    (21, 13, 'Trefl Premium Plus Quality - Blue Heron in the Wild -1000 Pieces', 'PREMIUM PLUS QUALITY 1000-piece puzzle featuring perfect piece fit and high-quality cardboard. Once assembled, the puzzle creates a 26.9 x 18.9 in image featuring retro posters.', NOW(), NULL, '5f8e16b6-2c84-4352-b0fc-908e2d84b4e1', NULL),
    (22, 13, 'Trefl Haifoss Waterfall, Iceland 2000 Piece Jigsaw', 'Trefl Haifoss Waterfall, Iceland 2000 Piece Jigsaw Puzzle Red 38"x27" Print, DIY Puzzle, Creative Fun, Classic Puzzle for Adults and Children from 14 Years Old', NOW(), NULL, '5f8e16b6-2c84-4352-b0fc-908e2d84b4e1', NULL),
    (23, 13, 'Trefl Castle in Sully-sur-Loire, France 3000 Piece Jigsaw Puzzle Red', 'Trefl Castle in Sully-sur-Loire, France 3000 Piece Jigsaw Puzzle Red 46"x33" Print, DIY Puzzle, Creative Fun, Classic Puzzle for Adults and Children from 15 Years Old', NOW(), NULL, '5f8e16b6-2c84-4352-b0fc-908e2d84b4e1', NULL),

    -- Toys
    (24, 14, 'LeapFrog Magic Adventures Globe (Frustration Free Packaging)', 'Go beyond countries and their capitals using this enhanced globe with a 2.8" video screen that explores cultures, animals, habitats and more through over five hours of BBC videos', NOW(), NULL, '5f8e16b6-2c84-4352-b0fc-908e2d84b4e1', NULL),
    (25, 14, 'Adena Montessori Wooden Toy for 6-12 Month Baby 3 Balls, Object Permanence Box with Tray', 'Adena Montessori Wooden Toy for 6-12 Month Baby 3 Balls, Object Permanence Box with Tray Colorful Learning Education Toy for Toddler Kid 1-2 Year Old, Preschool Developmental Girl and Boy Gift', NOW(), NULL, '5f8e16b6-2c84-4352-b0fc-908e2d84b4e1', NULL),
    (26, 14, 'Cat Construction Toys, Steel Dump Truck 16 Inches - Real Steel Body, Working Dump Bed', 'Cat Construction Toys, Steel Dump Truck 16" - Real Steel Body, Working Dump Bed, Oversize All-Terrain Wheels, Heavy-Duty Construction Vehicle for Indoor/Outdoor Play, Kids Ages 3 +', NOW(), NULL, '5f8e16b6-2c84-4352-b0fc-908e2d84b4e1', NULL),

    -- LEGO
    (27, 15, 'LEGO Technic Model Car Kit - Gift Idea for F1 Fans', 'F1 CAR MODEL KIT – Take pole position with this LEGO Technic Car model kit for adults, which is packed with features to delight F1 racing fans', NOW(), NULL, '5f8e16b6-2c84-4352-b0fc-908e2d84b4e1', NULL),
    (28, 15, 'LEGO Architecture New York City Model Kit', 'LEGO Architecture New York City Model Kit - Bedroom or Office Decor for Kids & Adults, Ages 12+ - Building Blocks to Display - NYC Gift & Souvenir Ideas - 21028', NOW(), NULL, '5f8e16b6-2c84-4352-b0fc-908e2d84b4e1', NULL);
INSERT INTO product_variant (id, product_id, price, quantity, image_url)
VALUES
    -- ASUS ROG Strix Scar 18
    (1, 1, 6564.99, 4, 'https://d2y2m9vdp01cgn.cloudfront.net/1778793071315_ASUS_ROG_Strix_Scar_18.jpg'),
    (2, 1, 4564.99, 7, 'https://d2y2m9vdp01cgn.cloudfront.net/1778793075944_ASUS_ROG_Strix_Scar_18.jpg'),
    (3, 1, 4924.99, 3, 'https://d2y2m9vdp01cgn.cloudfront.net/1778793077542_ASUS_ROG_Strix_Scar_18.jpg'),
    (4, 1, 6024.99, 1, 'https://d2y2m9vdp01cgn.cloudfront.net/1778793078527_ASUS_ROG_Strix_Scar_18.jpg'),

    -- Apple MacBook Air (13-inch)
    (5, 2, 1271.82, 9, 'https://d2y2m9vdp01cgn.cloudfront.net/1778793093183_Apple_MacBook_Air_(13-inch)_1.jpg'),
    (6, 2, 811.32, 11, 'https://d2y2m9vdp01cgn.cloudfront.net/1778793094720_Apple_MacBook_Air_(13-inch)_2.jpg'),

    -- HP Omen Max (16-inch)
    (7, 3, 3509, 72, 'https://d2y2m9vdp01cgn.cloudfront.net/1778793109447_HP_Omen_Max_(16-inch)_1.jpg'),
    (8, 3, 3509, 89, 'https://d2y2m9vdp01cgn.cloudfront.net/1778793111352_HP_Omen_Max_(16-inch)_2.jpg'),

    -- Microsoft Surface Pro 7
    (9, 4, 1599.99, 14, 'https://d2y2m9vdp01cgn.cloudfront.net/1778794441389_Microsoft_Surface_Pro_7_1.jpg'),
    (10, 4, 1299.99, 78, 'https://d2y2m9vdp01cgn.cloudfront.net/1778794443538_Microsoft_Surface_Pro_7_2.jpg'),

    -- MSI Vector HX 17
    (11, 5, 1599.99, 14, 'https://d2y2m9vdp01cgn.cloudfront.net/1778795132113_MSI_Vector_HX_17.jpg'),

    -- Samsung Galaxy S21
    (12, 6, 154.99, 34, 'https://d2y2m9vdp01cgn.cloudfront.net/1778798793793_Samsung_Galaxy_S21_1.jpg'),
    (13, 6, 145, 44, 'https://d2y2m9vdp01cgn.cloudfront.net/1778798796579_Samsung_Galaxy_S21_2.jpg'),

    -- Google Pixel 9
    (14, 7, 599.95, 34, 'https://d2y2m9vdp01cgn.cloudfront.net/1778799798672_Google_Pixel_9_1.jpg'),
    (15, 7, 599.95, 27, 'https://d2y2m9vdp01cgn.cloudfront.net/1778799799328_Google_Pixel_9_2.jpg'),
    (16, 7, 599.95, 4, 'https://d2y2m9vdp01cgn.cloudfront.net/1778799803273_Google_Pixel_9_3.jpg'),
    (17, 7, 599.95, 15, 'https://d2y2m9vdp01cgn.cloudfront.net/1778799806554_Google_Pixel_9_4.jpg'),

    -- Apple iPhone 17
    (18, 8, 676.64, 12, 'https://d2y2m9vdp01cgn.cloudfront.net/1778800692166_Apple_iPhone_17_1.jpg'),
    (19, 8, 673.86, 27, 'https://d2y2m9vdp01cgn.cloudfront.net/1778800696240_Apple_iPhone_17_2.jpg'),
    (20, 8, 865.86, 15, 'https://d2y2m9vdp01cgn.cloudfront.net/1778800699534_Apple_iPhone_17_3.jpg'),

    -- Samsung UN98DU9000 (98-inch) 4K Crystal UHD DU9000 (2024)
    (21, 9, 1699.99, 12, 'https://d2y2m9vdp01cgn.cloudfront.net/1778852891965_Samsung_UN98DU9000_(98-inch)_4K_Crystal_UHD_DU9000_(2024).jpg'),

    -- Sony BRAVIA 8 K65XR80C OLED 4K UHD Smart Google TV (Renewed)
    (22, 10, 999.99, 3, 'https://d2y2m9vdp01cgn.cloudfront.net/1778853494099_Sony_BRAVIA_8_K65XR80C_OLED_4K_UHD_Smart_Google_TV_(Renewed)_1.jpg'),
    (23, 10, 1098.98, 12, 'https://d2y2m9vdp01cgn.cloudfront.net/1778853494767_Sony_BRAVIA_8_K65XR80C_OLED_4K_UHD_Smart_Google_TV_(Renewed)_2.jpg'),

    -- Samsung QLED Q8F 4K UHD Smart TV (2025 Model)
    (24, 11, 397.99, 34, 'https://d2y2m9vdp01cgn.cloudfront.net/1778854207392_Samsung_QLED_Q8F_4K_UHD_Smart_TV_(2025_Model)_1.jpg'),
    (25, 11, 402.94, 8, 'https://d2y2m9vdp01cgn.cloudfront.net/1778854209573_Samsung_QLED_Q8F_4K_UHD_Smart_TV_(2025_Model)_2.jpg'),
    (26, 11, 569.99, 18, 'https://d2y2m9vdp01cgn.cloudfront.net/1778854212246_Samsung_QLED_Q8F_4K_UHD_Smart_TV_(2025_Model)_3.jpg'),

    -- Samsung QLED Q7F 4K UHD Smart TV (2025 Model, 65Q7F)
    (27, 12, 427.99, 34, 'https://d2y2m9vdp01cgn.cloudfront.net/1778854980224_Samsung_QLED_Q7F_4K_UHD_Smart_TV_(2025_Model,_65Q7F)_1.jpg'),
    (28, 12, 1847.95, 18, 'https://d2y2m9vdp01cgn.cloudfront.net/1778854982742_Samsung_QLED_Q7F_4K_UHD_Smart_TV_(2025_Model,_65Q7F)_2.jpg'),

    -- ANRABESS Womens Tops Oversized T Shirts Short Sleeve Crewneck
    (29, 13, 8.99, 78, 'https://d2y2m9vdp01cgn.cloudfront.net/1778865394000_ANRABESS_Womens_Tops_Oversized_T_Shirts_Short_Sleeve_Crewneck_1.jpg'),
    (30, 13, 8.99, 118, 'https://d2y2m9vdp01cgn.cloudfront.net/1778865396307_ANRABESS_Womens_Tops_Oversized_T_Shirts_Short_Sleeve_Crewneck_2.jpg'),
    (31, 13, 12.99, 132, 'https://d2y2m9vdp01cgn.cloudfront.net/1778865399127_ANRABESS_Womens_Tops_Oversized_T_Shirts_Short_Sleeve_Crewneck_3.jpg'),
    (32, 13, 14.99, 54, 'https://d2y2m9vdp01cgn.cloudfront.net/1778865402238_ANRABESS_Womens_Tops_Oversized_T_Shirts_Short_Sleeve_Crewneck_4.jpg'),
    (33, 13, 14.99, 2, 'https://d2y2m9vdp01cgn.cloudfront.net/1778865404970_ANRABESS_Womens_Tops_Oversized_T_Shirts_Short_Sleeve_Crewneck_5.jpg'),

    -- Runcati Mens Short Sleeve T-Shirts Casual Graphic Printed
    (34, 14, 9.99, 27, 'https://d2y2m9vdp01cgn.cloudfront.net/1778865883131_Runcati_Mens_Short_Sleeve_T-Shirts_Casual_Graphic_Printed_1.jpg'),
    (35, 14, 9.99, 14, 'https://d2y2m9vdp01cgn.cloudfront.net/1778865883660_Runcati_Mens_Short_Sleeve_T-Shirts_Casual_Graphic_Printed_2.jpg'),
    (36, 14, 9.99, 8, 'https://d2y2m9vdp01cgn.cloudfront.net/1778865887030_Runcati_Mens_Short_Sleeve_T-Shirts_Casual_Graphic_Printed_3.jpg'),
    (37, 14, 9.99, 152, 'https://d2y2m9vdp01cgn.cloudfront.net/1778865890361_Runcati_Mens_Short_Sleeve_T-Shirts_Casual_Graphic_Printed_4.jpg'),

    -- Baggy Jeans for Men Y2K Streetwear Vintage Wide Leg Loose
    (38, 15, 27.99, 132, 'https://d2y2m9vdp01cgn.cloudfront.net/1778887128595_Baggy_Jeans_for_Men_Y2K_Streetwear_Vintage_Wide_Leg_Loose_1.jpg'),
    (39, 15, 27.99, 149, 'https://d2y2m9vdp01cgn.cloudfront.net/1778887129143_Baggy_Jeans_for_Men_Y2K_Streetwear_Vintage_Wide_Leg_Loose_2.jpg'),
    (40, 15, 27.99, 89, 'https://d2y2m9vdp01cgn.cloudfront.net/1778887129703_Baggy_Jeans_for_Men_Y2K_Streetwear_Vintage_Wide_Leg_Loose_3.jpg'),

    -- Baggy Jeans for Men Y2K Streetwear Vintage Wide Leg Loose
    (41, 16, 38.99, 64, 'https://d2y2m9vdp01cgn.cloudfront.net/1778887792346_Sidefeel_Women''s_High_Waisted_Jeans_Strechy_Fashion_Raw_Hem_Straight_Leg_Ankle_Denim_Pants_with_Pockets_1.jpg'),
    (42, 16, 38.99, 32, 'https://d2y2m9vdp01cgn.cloudfront.net/1778887793442_Sidefeel_Women''s_High_Waisted_Jeans_Strechy_Fashion_Raw_Hem_Straight_Leg_Ankle_Denim_Pants_with_Pockets_2.jpg'),
    (43, 16, 38.99, 144, 'https://d2y2m9vdp01cgn.cloudfront.net/1778887797462_Sidefeel_Women''s_High_Waisted_Jeans_Strechy_Fashion_Raw_Hem_Straight_Leg_Ankle_Denim_Pants_with_Pockets_3.jpg'),
    (44, 16, 38.99, 71, 'https://d2y2m9vdp01cgn.cloudfront.net/1778887803127_Sidefeel_Women''s_High_Waisted_Jeans_Strechy_Fashion_Raw_Hem_Straight_Leg_Ankle_Denim_Pants_with_Pockets_4.jpg'),

    -- Padgene Womens Sneakers Air Cushion Running Shoes Lightweight Tennis Walking Shoes Mesh
    (45, 17, 25.99, 189, 'https://d2y2m9vdp01cgn.cloudfront.net/1779035846555_Padgene_Womens_Sneakers_Air_Cushion_Running_Shoes_Lightweight_Tennis_Walking_Shoes_Mesh_1.jpg'),
    (46, 17, 25.99, 132, 'https://d2y2m9vdp01cgn.cloudfront.net/1779035849581_Padgene_Womens_Sneakers_Air_Cushion_Running_Shoes_Lightweight_Tennis_Walking_Shoes_Mesh_2.jpg'),
    (47, 17, 25.99, 172, 'https://d2y2m9vdp01cgn.cloudfront.net/1779035853619_Padgene_Womens_Sneakers_Air_Cushion_Running_Shoes_Lightweight_Tennis_Walking_Shoes_Mesh_3.jpg'),

    -- Mens Running Shoes Tennis Sneakers Slip on Walking Gym Non Slip Work Shoe Lightweight
    (48, 18, 17.99, 128, 'https://d2y2m9vdp01cgn.cloudfront.net/1779036643116_Mens_Running_Shoes_Tennis_Sneakers_Slip_on_Walking_Gym_Non_Slip_Work_Shoe_Lightweight_1.jpg'),
    (49, 18, 17.99, 114, 'https://d2y2m9vdp01cgn.cloudfront.net/1779036644184_Mens_Running_Shoes_Tennis_Sneakers_Slip_on_Walking_Gym_Non_Slip_Work_Shoe_Lightweight_2.jpg'),
    (50, 18, 18.99, 58, 'https://d2y2m9vdp01cgn.cloudfront.net/1779036645994_Mens_Running_Shoes_Tennis_Sneakers_Slip_on_Walking_Gym_Non_Slip_Work_Shoe_Lightweight_3.jpg'),

    -- mysoft Women's High Heels Pumps Closed Pointed Toe Stiletto 4IN Heels Dress Wedding Shoes
    (51, 19, 39.09, 21, 'https://d2y2m9vdp01cgn.cloudfront.net/1779037489321_mysoft_Women''s_High_Heels_Pumps_Closed_Pointed_Toe_Stiletto_4IN_Heels_Dress_Wedding_Shoes_1.jpg'),
    (52, 19, 37.99, 9, 'https://d2y2m9vdp01cgn.cloudfront.net/1779037491547_mysoft_Women''s_High_Heels_Pumps_Closed_Pointed_Toe_Stiletto_4IN_Heels_Dress_Wedding_Shoes_2.jpg'),
    (53, 19, 38.99, 18, 'https://d2y2m9vdp01cgn.cloudfront.net/1779037496097_mysoft_Women''s_High_Heels_Pumps_Closed_Pointed_Toe_Stiletto_4IN_Heels_Dress_Wedding_Shoes_3.jpg'),
    (54, 19, 37.99, 23, 'https://d2y2m9vdp01cgn.cloudfront.net/1779037498618_mysoft_Women''s_High_Heels_Pumps_Closed_Pointed_Toe_Stiletto_4IN_Heels_Dress_Wedding_Shoes_4.jpg'),

    -- Clarks Men's Tilden Cap Oxford Shoe
    (55, 20, 68.85, 23, 'https://d2y2m9vdp01cgn.cloudfront.net/1779038074345_Clarks_Men''s_Tilden_Cap_Oxford_Shoe_1.jpg'),
    (56, 20, 68.85, 19, 'https://d2y2m9vdp01cgn.cloudfront.net/1779038077967_Clarks_Men''s_Tilden_Cap_Oxford_Shoe_2.jpg'),

    -- Trefl Premium Plus Quality - Blue Heron in the Wild -1000 Pieces
    (57, 21, 19.99, 87, 'https://d2y2m9vdp01cgn.cloudfront.net/1779197006220_Trefl_Premium_Plus_Quality_-_Blue_Heron_in_the_Wild_-1000_Pieces.jpg'),

    -- Trefl Haifoss Waterfall, Iceland 2000 Piece Jigsaw
    (58, 22, 19.99, 32, 'https://d2y2m9vdp01cgn.cloudfront.net/1779198024963_Trefl_Haifoss_Waterfall,_Iceland_2000_Piece_Jigsaw.jpg'),

    -- Trefl Castle in Sully-sur-Loire, France 3000 Piece Jigsaw Puzzle Red
    (59, 23, 32.99, 4, 'https://d2y2m9vdp01cgn.cloudfront.net/1779198424813_Trefl_Castle_in_Sully-sur-Loire,_France_3000_Piece_Jigsaw_Puzzle_Red.jpg'),

    -- LeapFrog Magic Adventures Globe (Frustration Free Packaging)
    (60, 24, 74.99, 9, 'https://d2y2m9vdp01cgn.cloudfront.net/1779201372553_LeapFrog_Magic_Adventures_Globe_(Frustration_Free_Packaging).jpg'),

    -- Adena Montessori Wooden Toy for 6-12 Month Baby 3 Balls, Object Permanence Box with Tray
    (61, 25, 15.99, 136, 'https://d2y2m9vdp01cgn.cloudfront.net/1779202387956_Adena_Montessori_Wooden_Toy_for_6-12_Month_Baby_3_Balls,_Object_Permanence_Box_with_Tray.jpg'),

    -- Cat Construction Toys, Steel Dump Truck 16 Inches - Real Steel Body, Working Dump Bed
    (62, 26, 20.95, 3, 'https://d2y2m9vdp01cgn.cloudfront.net/1779202829826_Cat_Construction_Toys,_Steel_Dump_Truck_16_Inches_-_Real_Steel_Body,_Working_Dump_Bed.jpg'),

    -- LEGO Technic Model Car Kit - Gift Idea for F1 Fans
    (63, 27, 228.58, 27, 'https://d2y2m9vdp01cgn.cloudfront.net/1779204976056_LEGO_Technic_Model_Car_Kit_-_Gift_Idea_for_F1_Fans_1.jpg'),
    (64, 27, 223.1, 22, 'https://d2y2m9vdp01cgn.cloudfront.net/1779204978772_LEGO_Technic_Model_Car_Kit_-_Gift_Idea_for_F1_Fans_2.jpg'),
    (65, 27, 219.95, 45, 'https://d2y2m9vdp01cgn.cloudfront.net/1779204982290_LEGO_Technic_Model_Car_Kit_-_Gift_Idea_for_F1_Fans_3.jpg'),

    -- LEGO Architecture New York City Model Kit
    (66, 28, 59.95, 2, 'https://d2y2m9vdp01cgn.cloudfront.net/1779205447428_LEGO_Architecture_New_York_City_Model_Kit.jpg');
INSERT INTO property_value (id, value)
VALUES
    -- ASUS ROG Strix Scar 18
    (1, 'ASUS'),
    (2, '18'),
    (3, 'Intel Ultra 9'),
    (4, '24'),
    (5, 'Intel Ultra 9‑275HX'),
    (6, 'RTX 50 Series'),
    (7, '16'),
    (8, 'RTX 5080'),
    (9, '32'),
    (10, '16384'),
    (11, 'Windows 11 Pro'),
    (12, 'Black'),

    (13, 'ASUS'),
    (14, '18'),
    (15, 'Intel Ultra 9'),
    (16, '24'),
    (17, 'Intel Ultra 9‑275HX'),
    (18, 'RTX 50 Series'),
    (19, '16'),
    (20, 'RTX 5080'),
    (21, '32'),
    (22, '4096'),
    (23, 'Windows 11 Pro'),
    (24, 'Black'),

    (25, 'ASUS'),
    (26, '18'),
    (27, 'Intel Ultra 9'),
    (28, '24'),
    (29, 'Intel Ultra 9‑275HX'),
    (30, 'RTX 50 Series'),
    (31, '16'),
    (32, 'RTX 5080'),
    (33, '64'),
    (34, '4096'),
    (35, 'Windows 11 Pro'),
    (36, 'Black'),

    (37, 'ASUS'),
    (38, '18'),
    (39, 'Intel Ultra 9'),
    (40, '24'),
    (41, 'Intel Ultra 9‑275HX'),
    (42, 'RTX 50 Series'),
    (43, '16'),
    (44, 'RTX 5080'),
    (45, '64'),
    (46, '8192'),
    (47, 'Windows 11 Pro'),
    (48, 'Black'),

    -- Apple MacBook Air (13-inch)
    (49, 'Apple'),
    (50, '13.3'),
    (51, '8th Gen'),
    (52, '2'),
    (53, '1.6GHz Dual-Core Intel Core i5'),
    (54, 'Intel UHD Graphics'),
    (55, '0'),
    (56, 'Intel UHD Graphics 617'),
    (57, '8'),
    (58, '256'),
    (59, 'Mac OS'),
    (60, 'Gold'),

    (61, 'Apple'),
    (62, '13.3'),
    (63, '8th Gen'),
    (64, '2'),
    (65, '1.6GHz Dual-Core Intel Core i5'),
    (66, 'Intel UHD Graphics'),
    (67, '0'),
    (68, 'Intel UHD Graphics 617'),
    (69, '8'),
    (70, '128'),
    (71, 'Mac OS'),
    (72, 'Silver'),

    -- HP Omen Max (16-inch)
    (73, 'HP'),
    (74, '16'),
    (75, 'Intel Ultra 9'),
    (76, '24'),
    (77, 'Intel Ultra 9‑275HX'),
    (78, 'RTX 50 Series'),
    (79, '24'),
    (80, 'RTX 5090'),
    (81, '32'),
    (82, '1024'),
    (83, 'Windows 11 Home'),
    (84, 'Shadow Black'),

    (85, 'HP'),
    (86, '16'),
    (87, 'Intel Ultra 9'),
    (88, '24'),
    (89, 'Intel Ultra 9‑275HX'),
    (90, 'RTX 50 Series'),
    (91, '24'),
    (92, 'RTX 5090'),
    (93, '32'),
    (94, '1024'),
    (95, 'Windows 11 Pro'),
    (96, 'Shadow Black'),

    -- Microsoft Surface Pro 7
    (97, 'Microsoft'),
    (98, '12.3'),
    (99, '10th Gen'),
    (100, '4'),
    (101, 'Intel Core i7‑1065G7'),
    (102, 'Intel Iris Plus Graphics'),
    (103, '0'),
    (104, 'Intel Iris Plus Graphics'),
    (105, '16'),
    (106, '1024'),
    (107, 'Windows 11 Home'),
    (108, 'Platinum'),

    (109, 'Microsoft'),
    (110, '12.3'),
    (111, '10th Gen'),
    (112, '4'),
    (113, 'Intel Core i7‑1065G7'),
    (114, 'Intel Iris Plus Graphics'),
    (115, '0'),
    (116, 'Intel Iris Plus Graphics'),
    (117, '16'),
    (118, '1024'),
    (119, 'Windows 11 Home'),
    (120, 'Matte Black'),

    -- MSI Vector HX 17
    (121, 'MSI'),
    (122, '17'),
    (123, '14th Gen'),
    (124, '24'),
    (125, 'Intel Core i9-14900HX'),
    (126, 'RTX 40 Series'),
    (127, '16'),
    (128, 'RTX 4090'),
    (129, '64'),
    (130, '2048'),
    (131, 'Windows 11 Pro'),
    (132, 'Black'),

    -- Samsung Galaxy S21
    (133, 'Samsung'),
    (134, '6.2'),
    (135, 'Snapdragon 888'),
    (136, '8'),
    (137, '128'),
    (138, '120'),
    (139, 'Android 11'),
    (140, '4000'),
    (141, 'Phantom Pink'),

    (142, 'Samsung'),
    (143, '6.2'),
    (144, 'Snapdragon 888'),
    (145, '8'),
    (146, '128'),
    (147, '120'),
    (148, 'Android 11'),
    (149, '4000'),
    (150, 'Phantom Violet'),

    -- Google Pixel 9
    (151, 'Google'),
    (152, '6.3'),
    (153, 'Google Tensor G4'),
    (154, '12'),
    (155, '256'),
    (156, '120'),
    (157, 'Android 14'),
    (158, '4575'),
    (159, 'Wintergreen'),

    (160, 'Google'),
    (161, '6.3'),
    (162, 'Google Tensor G4'),
    (163, '12'),
    (164, '256'),
    (165, '120'),
    (166, 'Android 14'),
    (167, '4575'),
    (168, 'Obsidian'),

    (169, 'Google'),
    (170, '6.3'),
    (171, 'Google Tensor G4'),
    (172, '12'),
    (173, '256'),
    (174, '120'),
    (175, 'Android 14'),
    (176, '4575'),
    (177, 'Peony'),

    (178, 'Google'),
    (179, '6.3'),
    (180, 'Google Tensor G4'),
    (181, '12'),
    (182, '256'),
    (183, '120'),
    (184, 'Android 14'),
    (185, '4575'),
    (186, 'Porcelain'),

    -- Apple iPhone 17
    (187, 'Apple'),
    (188, '6.3'),
    (189, 'Apple A18'),
    (190, '8'),
    (191, '256'),
    (192, '60'),
    (193, 'iOS 18'),
    (194, '3274'),
    (195, 'Mist Blue'),

    (196, 'Apple'),
    (197, '6.3'),
    (198, 'Apple A18'),
    (199, '8'),
    (200, '256'),
    (201, '60'),
    (202, 'iOS 18'),
    (203, '3274'),
    (204, 'Black'),

    (205, 'Apple'),
    (206, '6.3'),
    (207, 'Apple A18'),
    (208, '8'),
    (209, '512'),
    (210, '60'),
    (211, 'iOS 18'),
    (212, '3274'),
    (213, 'Sage'),

    -- Samsung UN98DU9000 (98-inch) 4K Crystal UHD DU9000 (2024)
    (214, 'Samsung'),
    (215, '98'),
    (216, 'LED'),
    (217, '120'),
    (218, '4K'),

    -- Sony BRAVIA 8 K65XR80C OLED 4K UHD Smart Google TV (Renewed)
    (219, 'Sony'),
    (220, '55'),
    (221, 'OLED'),
    (222, '120'),
    (223, '4K'),

    (224, 'Sony'),
    (225, '65'),
    (226, 'OLED'),
    (227, '120'),
    (228, '4K'),

    -- Samsung QLED Q8F 4K UHD Smart TV (2025 Model)
    (229, 'Samsung'),
    (230, '32'),
    (231, 'QLED'),
    (232, '60'),
    (233, '4K'),

    (234, 'Samsung'),
    (235, '50'),
    (236, 'QLED'),
    (237, '60'),
    (238, '4K'),

    (239, 'Samsung'),
    (240, '65'),
    (241, 'QLED'),
    (242, '120'),
    (243, '4K'),

    -- Samsung QLED Q7F 4K UHD Smart TV (2025 Model, 65Q7F)
    (244, 'Samsung'),
    (245, '65'),
    (246, 'QLED'),
    (247, '60'),
    (248, '4K'),

    (249, 'Samsung'),
    (250, '98'),
    (251, 'QLED'),
    (252, '120'),
    (253, '4K'),

    -- ANRABESS Womens Tops Oversized T Shirts Short Sleeve Crewneck
    (254, 'Female'),
    (255, 'S'),
    (256, 'Black'),
    (257, 'Short Sleeve'),

    (258, 'Female'),
    (259, 'M'),
    (260, 'White'),
    (261, 'Short Sleeve'),

    (262, 'Female'),
    (263, 'M'),
    (264, 'Blue Gray'),
    (265, 'Short Sleeve'),

    (266, 'Female'),
    (267, 'L'),
    (268, 'Dark Green'),
    (269, 'Short Sleeve'),

    (270, 'Female'),
    (271, 'XL'),
    (272, 'Floral Black'),
    (273, 'Short Sleeve'),

    -- Runcati Mens Short Sleeve T-Shirts Casual Graphic Printed
    (274, 'Male'),
    (275, 'L'),
    (276, 'Army Green'),
    (277, 'Short Sleeve'),

    (278, 'Male'),
    (279, 'M'),
    (280, 'Black'),
    (281, 'Short Sleeve'),

    (282, 'Male'),
    (283, 'M'),
    (284, 'Grey'),
    (285, 'Short Sleeve'),

    (286, 'Male'),
    (287, 'S'),
    (288, 'Burgundy'),
    (289, 'Short Sleeve'),

    -- Baggy Jeans for Men Y2K Streetwear Vintage Wide Leg Loose
    (290, 'Male'),
    (291, 'L'),
    (292, 'Light Blue'),
    (293, 'Wide Leg'),
    (294, 'Zipper'),

    (295, 'Male'),
    (296, 'M'),
    (297, 'Blue'),
    (298, 'Wide Leg'),
    (299, 'Zipper'),

    (300, 'Male'),
    (301, 'M'),
    (302, 'Dark Blue'),
    (303, 'Wide Leg'),
    (304, 'Zipper'),

    -- Baggy Jeans for Men Y2K Streetwear Vintage Wide Leg Loose
    (305, 'Female'),
    (306, 'S'),
    (307, 'Light Blue'),
    (308, 'Straight Leg'),
    (309, 'Zipper'),

    (310, 'Female'),
    (311, 'L'),
    (312, 'White'),
    (313, 'Straight Leg'),
    (314, 'Zipper'),

    (315, 'Female'),
    (316, 'M'),
    (317, 'Real Teal'),
    (318, 'Straight Leg'),
    (319, 'Zipper'),

    (320, 'Female'),
    (321, 'M'),
    (322, 'Sail Blue'),
    (323, 'Straight Leg'),
    (324, 'Zipper'),

    -- Padgene Womens Sneakers Air Cushion Running Shoes Lightweight Tennis Walking Shoes Mesh
    (325, 'Female'),
    (326, 'Pink'),
    (327, '7'),
    (328, 'Mesh'),

    (329, 'Female'),
    (330, 'Black'),
    (331, '7'),
    (332, 'Mesh'),

    (333, 'Female'),
    (334, 'White'),
    (335, '8'),
    (336, 'Mesh'),

    -- Mens Running Shoes Tennis Sneakers Slip on Walking Gym Non Slip Work Shoe Lightweight
    (337, 'Male'),
    (338, 'White'),
    (339, '9'),
    (340, 'Mesh'),

    (341, 'Male'),
    (342, 'Grey'),
    (343, '10'),
    (344, 'Mesh'),

    (345, 'Male'),
    (346, 'Black'),
    (347, '11'),
    (348, 'Mesh'),

    -- mysoft Women's High Heels Pumps Closed Pointed Toe Stiletto 4IN Heels Dress Wedding Shoes
    (349, 'Female'),
    (350, 'Red'),
    (351, '9'),
    (352, 'Synthetic'),

    (353, 'Female'),
    (354, 'White'),
    (355, '6'),
    (356, 'Synthetic'),

    (357, 'Female'),
    (358, 'Pink'),
    (359, '7'),
    (360, 'Synthetic'),

    (361, 'Female'),
    (362, 'Black'),
    (363, '8'),
    (364, 'Synthetic'),

    -- Clarks Men's Tilden Cap Oxford Shoe
    (365, 'Male'),
    (366, 'Brown'),
    (367, '11'),
    (368, 'Leather'),

    (369, 'Male'),
    (370, 'Black'),
    (371, '12'),
    (372, 'Leather'),

    -- Trefl Premium Plus Quality - Blue Heron in the Wild -1000 Pieces
    (373, 'Animals'),
    (374, '501-1000'),
    (375, '13|15'),

    -- Trefl Haifoss Waterfall, Iceland 2000 Piece Jigsaw
    (376, 'Nature'),
    (377, '1001-2000'),
    (378, '13|15'),

    -- Trefl Castle in Sully-sur-Loire, France 3000 Piece Jigsaw Puzzle Red
    (379, 'Architecture'),
    (380, '2001-5000'),
    (381, '13|15'),

    -- LeapFrog Magic Adventures Globe (Frustration Free Packaging)
    (382, 'Plastic'),
    (383, '4|6'),

    -- Adena Montessori Wooden Toy for 6-12 Month Baby 3 Balls, Object Permanence Box with Tray
    (384, 'Wood'),
    (385, '1|3'),

    -- Cat Construction Toys, Steel Dump Truck 16 Inches - Real Steel Body, Working Dump Bed
    (386, 'Metal'),
    (387, '4|6'),

    -- LEGO Technic Model Car Kit - Gift Idea for F1 Fans
    (388, '1001-2000'),
    (389, 'Cars'),
    (390, '16|99'),

    (391, '1001-2000'),
    (392, 'Cars'),
    (393, '16|99'),

    (394, '1001-2000'),
    (395, 'Cars'),
    (396, '16|99'),

    -- LEGO Architecture New York City Model Kit
    (397, '501-1000'),
    (398, 'Architecture'),
    (399, '16|99');
INSERT INTO product_variant_property_value_link (id, product_variant_id, property_id, property_value_id)
VALUES
    -- ASUS ROG Strix Scar 18
    (1, 1, 1, 1),
    (2, 1, 2, 2),
    (3, 1, 3, 3),
    (4, 1, 4, 4),
    (5, 1, 5, 5),
    (6, 1, 6, 6),
    (7, 1, 7, 7),
    (8, 1, 8, 8),
    (9, 1, 9, 9),
    (10, 1, 10, 10),
    (11, 1, 11, 11),
    (12, 1, 12, 12),

    (13, 2, 1, 13),
    (14, 2, 2, 14),
    (15, 2, 3, 15),
    (16, 2, 4, 16),
    (17, 2, 5, 17),
    (18, 2, 6, 18),
    (19, 2, 7, 19),
    (20, 2, 8, 20),
    (21, 2, 9, 21),
    (22, 2, 10, 22),
    (23, 2, 11, 23),
    (24, 2, 12, 24),

    (25, 3, 1, 25),
    (26, 3, 2, 26),
    (27, 3, 3, 27),
    (28, 3, 4, 28),
    (29, 3, 5, 29),
    (30, 3, 6, 30),
    (31, 3, 7, 31),
    (32, 3, 8, 32),
    (33, 3, 9, 33),
    (34, 3, 10, 34),
    (35, 3, 11, 35),
    (36, 3, 12, 36),

    (37, 4, 1, 37),
    (38, 4, 2, 38),
    (39, 4, 3, 39),
    (40, 4, 4, 40),
    (41, 4, 5, 41),
    (42, 4, 6, 42),
    (43, 4, 7, 43),
    (44, 4, 8, 44),
    (45, 4, 9, 45),
    (46, 4, 10, 46),
    (47, 4, 11, 47),
    (48, 4, 12, 48),

    -- Apple MacBook Air (13-inch)
    (49, 5, 1, 49),
    (50, 5, 2, 50),
    (51, 5, 3, 51),
    (52, 5, 4, 52),
    (53, 5, 5, 53),
    (54, 5, 6, 54),
    (55, 5, 7, 55),
    (56, 5, 8, 56),
    (57, 5, 9, 57),
    (58, 5, 10, 58),
    (59, 5, 11, 59),
    (60, 5, 12, 60),

    (61, 6, 1, 61),
    (62, 6, 2, 62),
    (63, 6, 3, 63),
    (64, 6, 4, 64),
    (65, 6, 5, 65),
    (66, 6, 6, 66),
    (67, 6, 7, 67),
    (68, 6, 8, 68),
    (69, 6, 9, 69),
    (70, 6, 10, 70),
    (71, 6, 11, 71),
    (72, 6, 12, 72),

    -- HP Omen Max (16-inch)
    (73, 7, 1, 73),
    (74, 7, 2, 74),
    (75, 7, 3, 75),
    (76, 7, 4, 76),
    (77, 7, 5, 77),
    (78, 7, 6, 78),
    (79, 7, 7, 79),
    (80, 7, 8, 80),
    (81, 7, 9, 81),
    (82, 7, 10, 82),
    (83, 7, 11, 83),
    (84, 7, 12, 84),

    (85, 8, 1, 85),
    (86, 8, 2, 86),
    (87, 8, 3, 87),
    (88, 8, 4, 88),
    (89, 8, 5, 89),
    (90, 8, 6, 90),
    (91, 8, 7, 91),
    (92, 8, 8, 92),
    (93, 8, 9, 93),
    (94, 8, 10, 94),
    (95, 8, 11, 95),
    (96, 8, 12, 96),

    -- Microsoft Surface Pro 7
    (97, 9, 1, 97),
    (98, 9, 2, 98),
    (99, 9, 3, 99),
    (100, 9, 4, 100),
    (101, 9, 5, 101),
    (102, 9, 6, 102),
    (103, 9, 7, 103),
    (104, 9, 8, 104),
    (105, 9, 9, 105),
    (106, 9, 10, 106),
    (107, 9, 11, 107),
    (108, 9, 12, 108),

    (109, 10, 1, 109),
    (110, 10, 2, 110),
    (111, 10, 3, 111),
    (112, 10, 4, 112),
    (113, 10, 5, 113),
    (114, 10, 6, 114),
    (115, 10, 7, 115),
    (116, 10, 8, 116),
    (117, 10, 9, 117),
    (118, 10, 10, 118),
    (119, 10, 11, 119),
    (120, 10, 12, 120),

    -- MSI Vector HX 17
    (121, 11, 1, 121),
    (122, 11, 2, 122),
    (123, 11, 3, 123),
    (124, 11, 4, 124),
    (125, 11, 5, 125),
    (126, 11, 6, 126),
    (127, 11, 7, 127),
    (128, 11, 8, 128),
    (129, 11, 9, 129),
    (130, 11, 10, 130),
    (131, 11, 11, 131),
    (132, 11, 12, 132),

    -- Samsung Galaxy S21
    (133, 12, 13, 133),
    (134, 12, 14, 134),
    (135, 12, 15, 135),
    (136, 12, 16, 136),
    (137, 12, 17, 137),
    (138, 12, 18, 138),
    (139, 12, 19, 139),
    (140, 12, 20, 140),
    (141, 12, 21, 141),

    (142, 13, 13, 142),
    (143, 13, 14, 143),
    (144, 13, 15, 144),
    (145, 13, 16, 145),
    (146, 13, 17, 146),
    (147, 13, 18, 147),
    (148, 13, 19, 148),
    (149, 13, 20, 149),
    (150, 13, 21, 150),

    -- Google Pixel 9
    (151, 14, 13, 151),
    (152, 14, 14, 152),
    (153, 14, 15, 153),
    (154, 14, 16, 154),
    (155, 14, 17, 155),
    (156, 14, 18, 156),
    (157, 14, 19, 157),
    (158, 14, 20, 158),
    (159, 14, 21, 159),

    (160, 15, 13, 160),
    (161, 15, 14, 161),
    (162, 15, 15, 162),
    (163, 15, 16, 163),
    (164, 15, 17, 164),
    (165, 15, 18, 165),
    (166, 15, 19, 166),
    (167, 15, 20, 167),
    (168, 15, 21, 168),

    (169, 16, 13, 169),
    (170, 16, 14, 170),
    (171, 16, 15, 171),
    (172, 16, 16, 172),
    (173, 16, 17, 173),
    (174, 16, 18, 174),
    (175, 16, 19, 175),
    (176, 16, 20, 176),
    (177, 16, 21, 177),

    (178, 17, 13, 178),
    (179, 17, 14, 179),
    (180, 17, 15, 180),
    (181, 17, 16, 181),
    (182, 17, 17, 182),
    (183, 17, 18, 183),
    (184, 17, 19, 184),
    (185, 17, 20, 185),
    (186, 17, 21, 186),

    -- Apple iPhone 17
    (187, 18, 13, 187),
    (188, 18, 14, 188),
    (189, 18, 15, 189),
    (190, 18, 16, 190),
    (191, 18, 17, 191),
    (192, 18, 18, 192),
    (193, 18, 19, 193),
    (194, 18, 20, 194),
    (195, 18, 21, 195),

    (196, 19, 13, 196),
    (197, 19, 14, 197),
    (198, 19, 15, 198),
    (199, 19, 16, 199),
    (200, 19, 17, 200),
    (201, 19, 18, 201),
    (202, 19, 19, 202),
    (203, 19, 20, 203),
    (204, 19, 21, 204),

    (205, 20, 13, 205),
    (206, 20, 14, 206),
    (207, 20, 15, 207),
    (208, 20, 16, 208),
    (209, 20, 17, 209),
    (210, 20, 18, 210),
    (211, 20, 19, 211),
    (212, 20, 20, 212),
    (213, 20, 21, 213),

    -- Samsung UN98DU9000 (98-inch) 4K Crystal UHD DU9000 (2024)
    (214, 21, 22, 214),
    (215, 21, 23, 215),
    (216, 21, 24, 216),
    (217, 21, 25, 217),
    (218, 21, 26, 218),

    -- Sony BRAVIA 8 K65XR80C OLED 4K UHD Smart Google TV (Renewed)
    (219, 22, 22, 219),
    (220, 22, 23, 220),
    (221, 22, 24, 221),
    (222, 22, 25, 222),
    (223, 22, 26, 223),

    (224, 23, 22, 224),
    (225, 23, 23, 225),
    (226, 23, 24, 226),
    (227, 23, 25, 227),
    (228, 23, 26, 228),

    -- Samsung QLED Q8F 4K UHD Smart TV (2025 Model)
    (229, 24, 22, 229),
    (230, 24, 23, 230),
    (231, 24, 24, 231),
    (232, 24, 25, 232),
    (233, 24, 26, 233),

    (234, 25, 22, 234),
    (235, 25, 23, 235),
    (236, 25, 24, 236),
    (237, 25, 25, 237),
    (238, 25, 26, 238),

    (239, 26, 22, 239),
    (240, 26, 23, 240),
    (241, 26, 24, 241),
    (242, 26, 25, 242),
    (243, 26, 26, 243),

    -- Samsung QLED Q7F 4K UHD Smart TV (2025 Model, 65Q7F)
    (244, 27, 22, 244),
    (245, 27, 23, 245),
    (246, 27, 24, 246),
    (247, 27, 25, 247),
    (248, 27, 26, 248),

    (249, 28, 22, 249),
    (250, 28, 23, 250),
    (251, 28, 24, 251),
    (252, 28, 25, 252),
    (253, 28, 26, 253),

    -- ANRABESS Womens Tops Oversized T Shirts Short Sleeve Crewneck
    (254, 29, 27, 254),
    (255, 29, 28, 255),
    (256, 29, 29, 256),
    (257, 29, 30, 257),

    (258, 30, 27, 258),
    (259, 30, 28, 259),
    (260, 30, 29, 260),
    (261, 30, 30, 261),

    (262, 31, 27, 262),
    (263, 31, 28, 263),
    (264, 31, 29, 264),
    (265, 31, 30, 265),

    (266, 32, 27, 266),
    (267, 32, 28, 267),
    (268, 32, 29, 268),
    (269, 32, 30, 269),

    (270, 33, 27, 270),
    (271, 33, 28, 271),
    (272, 33, 29, 272),
    (273, 33, 30, 273),

    -- Runcati Mens Short Sleeve T-Shirts Casual Graphic Printed
    (274, 34, 27, 274),
    (275, 34, 28, 275),
    (276, 34, 29, 276),
    (277, 34, 30, 277),

    (278, 35, 27, 278),
    (279, 35, 28, 279),
    (280, 35, 29, 280),
    (281, 35, 30, 281),

    (282, 36, 27, 282),
    (283, 36, 28, 283),
    (284, 36, 29, 284),
    (285, 36, 30, 285),

    (286, 37, 27, 286),
    (287, 37, 28, 287),
    (288, 37, 29, 288),
    (289, 37, 30, 289),

    -- Baggy Jeans for Men Y2K Streetwear Vintage Wide Leg Loose
    (290, 38, 27, 290),
    (291, 38, 28, 291),
    (292, 38, 29, 292),
    (293, 38, 31, 293),
    (294, 38, 32, 294),

    (295, 39, 27, 295),
    (296, 39, 28, 296),
    (297, 39, 29, 297),
    (298, 39, 31, 298),
    (299, 39, 32, 299),

    (300, 40, 27, 300),
    (301, 40, 28, 301),
    (302, 40, 29, 302),
    (303, 40, 31, 303),
    (304, 40, 32, 304),

    -- Baggy Jeans for Men Y2K Streetwear Vintage Wide Leg Loose
    (305, 41, 27, 305),
    (306, 41, 28, 306),
    (307, 41, 29, 307),
    (308, 41, 31, 308),
    (309, 41, 32, 309),

    (310, 42, 27, 310),
    (311, 42, 28, 311),
    (312, 42, 29, 312),
    (313, 42, 31, 313),
    (314, 42, 32, 314),

    (315, 43, 27, 315),
    (316, 43, 28, 316),
    (317, 43, 29, 317),
    (318, 43, 31, 318),
    (319, 43, 32, 319),

    (320, 44, 27, 320),
    (321, 44, 28, 321),
    (322, 44, 29, 322),
    (323, 44, 31, 323),
    (324, 44, 32, 324),

    -- Padgene Womens Sneakers Air Cushion Running Shoes Lightweight Tennis Walking Shoes Mesh
    (325, 45, 27, 325),
    (326, 45, 29, 326),
    (327, 45, 33, 327),
    (328, 45, 34, 328),

    (329, 46, 27, 329),
    (330, 46, 29, 330),
    (331, 46, 33, 331),
    (332, 46, 34, 332),

    (333, 47, 27, 333),
    (334, 47, 29, 334),
    (335, 47, 33, 335),
    (336, 47, 34, 336),

    -- Mens Running Shoes Tennis Sneakers Slip on Walking Gym Non Slip Work Shoe Lightweight
    (337, 48, 27, 337),
    (338, 48, 29, 338),
    (339, 48, 33, 339),
    (340, 48, 34, 340),

    (341, 49, 27, 341),
    (342, 49, 29, 342),
    (343, 49, 33, 343),
    (344, 49, 34, 344),

    (345, 50, 27, 345),
    (346, 50, 29, 346),
    (347, 50, 33, 347),
    (348, 50, 34, 348),

    -- mysoft Women's High Heels Pumps Closed Pointed Toe Stiletto 4IN Heels Dress Wedding Shoes
    (349, 51, 27, 349),
    (350, 51, 29, 350),
    (351, 51, 33, 351),
    (352, 51, 34, 352),

    (353, 52, 27, 353),
    (354, 52, 29, 354),
    (355, 52, 33, 355),
    (356, 52, 34, 356),

    (357, 53, 27, 357),
    (358, 53, 29, 358),
    (359, 53, 33, 359),
    (360, 53, 34, 360),

    (361, 54, 27, 361),
    (362, 54, 29, 362),
    (363, 54, 33, 363),
    (364, 54, 34, 364),

    -- Clarks Men's Tilden Cap Oxford Shoe
    (365, 55, 27, 365),
    (366, 55, 29, 366),
    (367, 55, 33, 367),
    (368, 55, 34, 368),

    (369, 56, 27, 369),
    (370, 56, 29, 370),
    (371, 56, 33, 371),
    (372, 56, 34, 372),

    -- Trefl Premium Plus Quality - Blue Heron in the Wild -1000 Pieces
    (373, 57, 36, 373),
    (374, 57, 37, 374),
    (375, 57, 35, 375),

    -- Trefl Haifoss Waterfall, Iceland 2000 Piece Jigsaw
    (376, 58, 36, 376),
    (377, 58, 37, 377),
    (378, 58, 35, 378),

    -- Trefl Castle in Sully-sur-Loire, France 3000 Piece Jigsaw Puzzle Red
    (379, 59, 36, 379),
    (380, 59, 37, 380),
    (381, 59, 35, 381),

    -- LeapFrog Magic Adventures Globe (Frustration Free Packaging)
    (382, 60, 38, 382),
    (383, 60, 35, 383),

    -- Adena Montessori Wooden Toy for 6-12 Month Baby 3 Balls, Object Permanence Box with Tray
    (384, 61, 38, 384),
    (385, 61, 35, 385),

    -- Cat Construction Toys, Steel Dump Truck 16 Inches - Real Steel Body, Working Dump Bed
    (386, 62, 38, 386),
    (387, 62, 35, 387),

    -- LEGO Technic Model Car Kit - Gift Idea for F1 Fans
    (388, 63, 39, 388),
    (389, 63, 40, 389),
    (390, 63, 35, 390),

    (391, 64, 39, 391),
    (392, 64, 40, 392),
    (393, 64, 35, 393),

    (394, 65, 39, 394),
    (395, 65, 40, 395),
    (396, 65, 35, 396),

    -- LEGO Architecture New York City Model Kit
    (397, 66, 39, 397),
    (398, 66, 40, 398),
    (399, 66, 35, 399);
------------------------------------------------------------------------------------------------------------------------
SELECT setval('product_seq', (SELECT COALESCE(MAX(id), 1) + 1 FROM product));
SELECT setval('product_variant_seq', (SELECT COALESCE(MAX(id), 1) + 1 FROM product_variant));
SELECT setval('property_value_seq', (SELECT COALESCE(MAX(id), 1) + 1 FROM property_value));
SELECT setval('product_variant_property_value_link_seq',
              (SELECT COALESCE(MAX(id), 1) + 1 FROM product_variant_property_value_link));