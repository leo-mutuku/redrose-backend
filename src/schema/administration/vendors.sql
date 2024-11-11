CREATE TABLE vendors(
    vendor_id BIGINT PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_phone VARCHAR(255) NOT NULL UNIQUE,
    vendor_email VARCHAR(255) ,
    vendor_balance NUMERIC(15,2 ) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL,
    created_by VARCHAR(255)
)