CREATE TABLE suppliers(
    supplier_id BIGINT PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_phone VARCHAR(255) NOT NULL UNIQUE,
    supplier_email VARCHAR(255) ,
    supplier_balance NUMERIC(15,2 ) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
)