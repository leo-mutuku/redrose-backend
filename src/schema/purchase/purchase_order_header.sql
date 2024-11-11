CREATE purchase_order_header(
    purchase_order_header_id BIGSERIAL PRIMARY KEY,
    purchase_order_number BIGSERIAL NOT NULL UNIQUE,
    supplier_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
)