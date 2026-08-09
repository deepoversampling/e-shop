INSERT INTO property (id, name, unit)
VALUES
-- Laptops
(1, 'Laptop Brand', ''),
(2, 'Laptop Screen Size', 'in'),
(3, 'Laptop CPU Generation', ''),
(4, 'Laptop CPU Cores', 'cores'),
(5, 'Laptop CPU Model', ''),
(6, 'Laptop GPU Generation', ''),
(7, 'Laptop GPU Memory', 'GB'),
(8, 'Laptop GPU Model', ''),
(9, 'Laptop RAM Size', 'GB'),
(10, 'Laptop Memory Storage Capacity', 'GB'),
(11, 'Laptop Operating System', ''),
(12, 'Laptop Color', ''),

-- Smartphones
(13, 'Smartphone Brand', ''),
(14, 'Smartphone Screen Size', 'in'),
(15, 'Smartphone CPU Model', ''),
(16, 'Smartphone RAM Size', 'GB'),
(17, 'Smartphone Memory Storage Capacity', 'GB'),
(18, 'Smartphone Refresh Rate', 'Hz'),
(19, 'Smartphone OS Version', ''),
(20, 'Smartphone Battery Capacity', 'mAh'),
(21, 'Smartphone Color', ''),

-- TV
(22, 'TV Brand', ''),
(23, 'TV Screen Size', 'in'),
(24, 'TV Display Technology', ''),
(25, 'TV Refresh Rate', 'Hz'),
(26, 'TV Resolution', ''),

-- Clothing & Shoes
(27, 'Clothing&Shoes Sex', ''),

-- Clothing
(28, 'Clothing Size', ''),
(29, 'Clothing Color', ''),

-- T-Shirts
(30, 'T-Shirts Sleeve Type', ''),

-- Jeans
(31, 'Jeans Fit Type', ''),
(32, 'Jeans Closure Type', ''),

-- Shoes
(33, 'Shoes Size', ''),
(34, 'Shoes Fabric Type', ''),

-- Toys & Hobbies
(35, 'Toys&Hobbies Age', 'years'),

-- Puzzles
(36, 'Puzzles Theme', ''),
(37, 'Puzzles Piece Count', 'pieces'),

-- Toys
(38, 'Toys Material', ''),

-- LEGO
(39, 'LEGO Piece Count', 'pieces'),
(40, 'LEGO Theme', '');
------------------------------------------------------------------------------------------------------------------------
INSERT INTO property_preset (id, property_id, value)
VALUES
-- Laptop Brand
(1, 1, 'Apple'),
(2, 1, 'ASUS'),
(3, 1, 'HP'),
(4, 1, 'Microsoft'),
(5, 1, 'MSI'),

-- Laptop Screen Size
(6, 2, '12.3'),
(7, 2, '13.3'),
(8, 2, '14'),
(9, 2, '15.6'),
(10, 2, '16'),
(11, 2, '17'),
(12, 2, '18'),

-- Laptop CPU Generation
(13, 3, '8th Gen'),
(14, 3, '10th Gen'),
(15, 3, '14th Gen'),
(16, 3, 'Intel Ultra 9'),

-- Laptop CPU Cores
(17, 4, '2'),
(18, 4, '4'),
(19, 4, '8'),
(20, 4, '24'),

-- Laptop CPU Model
(21, 5, '1.6GHz Dual-Core Intel Core i5'),
(22, 5, 'Intel Core i7‑1065G7'),
(23, 5, 'Intel Core i9‑14900HX'),
(24, 5, 'Intel Ultra 9‑275HX'),

-- Laptop GPU Generation
(25, 6, 'RTX 40 Series'),
(26, 6, 'RTX 50 Series'),
(27, 6, 'Intel UHD Graphics'),
(28, 6, 'Intel Iris Plus Graphics'),

-- Laptop GPU Memory
(29, 7, '0'),
(30, 7, '8'),
(31, 7, '16'),
(32, 7, '24'),

-- Laptop GPU Model
(33, 8, 'RTX 4090'),
(34, 8, 'RTX 5080'),
(35, 8, 'RTX 5090'),
(36, 8, 'Intel UHD Graphics 617'),
(37, 8, 'Intel Iris Plus Graphics'),

-- Laptop RAM Size
(38, 9, '8'),
(39, 9, '16'),
(40, 9, '32'),
(41, 9, '64'),
(42, 9, '96'),

-- Laptop Memory Storage Capacity
(43, 10, '128'),
(44, 10, '256'),
(45, 10, '512'),
(46, 10, '1024'),
(47, 10, '2048'),
(48, 10, '4096'),
(49, 10, '8192'),
(50, 10, '16384'),

-- Laptop Operating System
(51, 11, 'Mac OS'),
(52, 11, 'Windows 10 Home'),
(53, 11, 'Windows 10 Pro'),
(54, 11, 'Windows 11 Home'),
(55, 11, 'Windows 11 Pro'),

-- Laptop Color
(56, 12, 'Gold'),
(57, 12, 'Silver'),
(58, 12, 'Platinum'),
(59, 12, 'Black'),
(60, 12, 'Shadow Black'),
(61, 12, 'Matte Black'),

-- Smartphone Brand
(62, 13, 'Apple'),
(63, 13, 'Samsung'),
(64, 13, 'Google'),

-- Smartphone Screen Size
(65, 14, '6.2'),
(66, 14, '6.3'),

-- Laptop CPU Model
(67, 15, 'Snapdragon 888'),
(68, 15, 'Google Tensor G4'),
(69, 15, 'Apple A18'),

-- Smartphone RAM Size
(70, 16, '8'),
(71, 16, '12'),

-- Smartphone Memory Storage Capacity
(72, 17, '128'),
(73, 17, '256'),
(74, 17, '512'),

-- Smartphone Refresh Rate
(75, 18, '60'),
(76, 18, '120'),

-- Smartphone OS Version
(77, 19, 'Android 11'),
(78, 19, 'Android 14'),
(79, 19, 'iOS 18'),

-- Smartphone Battery Capacity
(80, 20, '4000'),
(81, 20, '4575'),
(82, 20, '3274'),

-- Smartphone Color
(83, 21, 'Phantom Pink'),
(84, 21, 'Phantom Violet'),
(85, 21, 'Wintergreen'),
(86, 21, 'Obsidian'),
(87, 21, 'Peony'),
(88, 21, 'Porcelain'),
(89, 21, 'Mist Blue'),
(90, 21, 'Black'),
(91, 21, 'Sage'),

-- TV Brand
(92, 22, 'Sony'),
(93, 22, 'Samsung'),

-- TV Screen Size
(94, 23, '32'),
(95, 23, '43'),
(96, 23, '50'),
(97, 23, '55'),
(98, 23, '65'),
(99, 23, '75'),
(100, 23, '85'),
(101, 23, '98'),

-- TV Display Technology
(102, 24, 'LED'),
(103, 24, 'OLED'),
(104, 24, 'QLED'),

-- TV Refresh Rate
(105, 25, '60'),
(106, 25, '120'),
(107, 25, '144'),

-- TV Resolution
(108, 26, 'HD'),
(109, 26, 'Full HD'),
(110, 26, '4K'),
(111, 26, '8K'),

-- Clothing & Shoes Sex
(112, 27, 'Male'),
(113, 27, 'Female'),

-- Clothing Size
(114, 28, 'XS'),
(115, 28, 'S'),
(116, 28, 'M'),
(117, 28, 'L'),
(118, 28, 'XL'),
(119, 28, 'XXL'),

-- Clothing Color
(120, 29, 'Black'),
(121, 29, 'White'),
(122, 29, 'Blue Gray'),
(123, 29, 'Dark Green'),
(124, 29, 'Floral Black'),
(125, 29, 'Army Green'),
(126, 29, 'Grey'),
(127, 29, 'Burgundy'),
(128, 29, 'Light Blue'),
(129, 29, 'Blue'),
(130, 29, 'Real Teal'),
(131, 29, 'Sail Blue'),
(132, 29, 'Pink'),
(133, 29, 'Red'),
(134, 29, 'Brown'),

-- T-Shirts Sleeve Type
(135, 30, 'Short Sleeve'),
(136, 30, 'Long Sleeve'),
(137, 30, 'Sleeveless'),
(138, 30, 'Cap Sleeve'),
(139, 30, 'Raglan Sleeve'),

-- Jeans Fit Type
(140, 31, 'Straight Leg'),
(141, 31, 'Slim Fit'),
(142, 31, 'Skinny'),
(143, 31, 'Bootcut'),
(144, 31, 'Wide Leg'),

-- Jeans Closure Type
(145, 32, 'Zipper'),
(146, 32, 'Buttons'),
(147, 32, 'Snap'),

-- Shoes Size
(148, 33, '5'),
(149, 33, '6'),
(150, 33, '7'),
(151, 33, '8'),
(152, 33, '9'),
(153, 33, '10'),
(154, 33, '11'),
(155, 33, '12'),

-- Shoes Fabric Type
(156, 34, 'Leather'),
(157, 34, 'Synthetic'),
(158, 34, 'Mesh'),

-- Toys & Hobbies Recommended Age Group
(159, 35, '1|3'),
(160, 35, '4|6'),
(161, 35, '7|9'),
(162, 35, '10|12'),
(163, 35, '13|15'),
(164, 35, '16|99'),

-- Puzzles Theme
(165, 36, 'Nature'),
(166, 36, 'Architecture'),
(167, 36, 'Cartoons'),
(168, 36, 'Animals'),
(169, 36, 'Fantasy'),
(170, 36, 'Art & Paintings'),

-- Puzzles Piece Count
(171, 37, '12-50'),
(172, 37, '51-100'),
(173, 37, '101-500'),
(174, 37, '501-1000'),
(175, 37, '1001-2000'),
(176, 37, '2001-5000'),
(177, 37, '5001-18000'),

-- Toys Material
(178, 38, 'Plastic'),
(179, 38, 'Wood'),
(180, 38, 'Metal'),

-- LEGO Piece Count
(181, 39, '0-200'),
(182, 39, '201-500'),
(183, 39, '501-1000'),
(184, 39, '1001-2000'),
(185, 39, '2001-4000'),
(186, 39, '4001-6000'),
(187, 39, '6001-12000'),

-- LEGO Theme
(188, 40, 'City'),
(189, 40, 'Star Wars'),
(190, 40, 'Technic'),
(191, 40, 'Cars'),
(192, 40, 'Architecture'),
(193, 40, 'Creator'),
(194, 40, 'Nature'),
(195, 40, 'Friends'),
(196, 40, 'Animals');
------------------------------------------------------------------------------------------------------------------------
SELECT setval('property_seq', (SELECT COALESCE(MAX(id), 1) + 1 FROM property));
SELECT setval('property_preset_seq', (SELECT COALESCE(MAX(id), 1) + 1 FROM property_preset));