INSERT INTO category_template (id, category_id)
VALUES (1, 3), -- Laptops
       (2, 4), -- Smartphones
       (3, 5), -- TV
       (4, 7), -- T-Shirts
       (5, 8), -- Jeans
       (6, 10), -- Sport Shoes
       (7, 11), -- Elegant Shoes
       (8, 13), -- Puzzles
       (9, 14), -- Toys
       (10, 15); -- LEGO
------------------------------------------------------------------------------------------------------------------------
INSERT INTO category_template_property_link (category_template_id, property_id)
VALUES
-- Laptops
(1, 1),  -- Brand
(1, 2),  -- Screen Size
(1, 3),  -- CPU Generation
(1, 4),  -- CPU Cores
(1, 5),  -- CPU Model
(1, 6),  -- GPU Generation
(1, 7),  -- GPU Memory
(1, 8),  -- GPU Model
(1, 9),  -- RAM Size
(1, 10), -- Hard Disk Size
(1, 11), -- Operating System
(1, 12), -- Color

-- Smartphones
(2, 13), -- Brand
(2, 14), -- Screen Size
(2, 15), -- CPU Model
(2, 16), -- RAM Size
(2, 17), -- Memory Storage Capacity
(2, 18), -- Refresh Rate
(2, 19), -- OS Version
(2, 20), -- Battery Capacity
(2, 21), -- Color

-- TV
(3, 22), -- Brand
(3, 23), -- Screen Size
(3, 24), -- Display Technology
(3, 25), -- Refresh Rate
(3, 26), -- Resolution

-- T-Shirts
(4, 27), -- Sex
(4, 28), -- Size
(4, 29), -- Color
(4, 30), -- Sleeve Type

-- Jeans
(5, 27), -- Sex
(5, 28), -- Size
(5, 29), -- Color
(5, 31), -- Fit Type
(5, 32), -- Jeans Closure Type

-- Sport Shoes
(6, 27), -- Sex
(6, 29), -- Color
(6, 33), -- Size
(6, 34), -- Fabric Type

-- Elegant Shoes
(7, 27), -- Sex
(7, 29), -- Color
(7, 33), -- Size
(7, 34), -- Fabric Type

-- Puzzles
(8, 36), -- Theme
(8, 37), -- Piece Count
(8, 35), -- Recommended Age Group

-- Toys
(9, 38), -- Material
(9, 35), -- Recommended Age Group

-- LEGO
(10, 39), -- Piece Count
(10, 40), -- Theme
(10, 35); -- Recommended Age Group
------------------------------------------------------------------------------------------------------------------------
SELECT setval('category_template_seq', (SELECT COALESCE(MAX(id), 1) + 1 FROM category_template));