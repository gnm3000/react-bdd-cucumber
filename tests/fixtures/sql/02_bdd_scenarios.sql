-- Deterministic integration fixtures for the BDD shop test stack.
-- Mutable scenario data is reset on each docker-compose.test.yml run.

DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;

INSERT INTO products (id, name, price) VALUES
    ('0', 'Schemathesis Coverage Product', 50),
    ('p1', 'Product A', 100),
    ('p2', 'Product B', 200),
    ('p3', 'Product C', 300),
    ('p4', 'PostgreSQL Demo Product', 450),
    ('p5', 'BDD Fixture Product', 550)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price;
