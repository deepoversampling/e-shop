INSERT INTO category (id, name, icon, parent_id)
VALUES (1, 'All Categories', NULL, NULL);

-- Electronics
INSERT INTO category (id, name, icon, parent_id)
VALUES (2, 'Electronics', NULL, 1),
       (3, 'Laptops', 'fas fa-laptop', 2),
       (4, 'Smartphones', 'fas fa-mobile-alt', 2),
       (5, 'TV', 'fas fa-tv', 2);

-- Clothing & Shoes
INSERT INTO category (id, name, icon, parent_id)
VALUES (6, 'Clothing & Shoes', NULL, 1),
       (7, 'T-Shirts', 'fas fa-tshirt', 6),
       (8, 'Jeans', 'fas fa-person', 6),
       (9, 'Shoes', NULL, 6),
       (10, 'Sport Shoes', 'fas fa-shoe-prints', 9),
       (11, 'Elegant Shoes', 'fas fa-shoe-prints', 9);

-- Toys & Hobbies
INSERT INTO category (id, name, icon, parent_id)
VALUES (12, 'Toys & Hobbies', NULL, 1),
       (13, 'Puzzles', 'fas fa-puzzle-piece', 12),
       (14, 'Toys', 'fas fa-robot', 12),
       (15, 'LEGO', 'fas fa-cubes', 12);

------------------------------------------------------------------------------------------------------------------------
SELECT setval('category_seq', (SELECT COALESCE(MAX(id), 1) + 1 FROM category));

/*1 All Categories
├── 2 Electronics
│   ├── 3 Laptops
│   ├── 4 Smartphones
│   └── 5 TV
├── 6 Clothing & Shoes
│   ├── 7 T-Shirts
│   ├── 8 Jeans
│   └── 9 Shoes
│       ├── 10 Sport Shoes
│       └── 11 Elegant Shoes
└── 12 Toys & Hobbies
    ├── 13 Puzzles
    ├── 14 Toys
    └── 15 LEGO*/