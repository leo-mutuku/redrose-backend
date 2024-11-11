CREATE purchase_order_line(
    purchase_order_line_id BIGSERIAL PRIMARY KEY,
    purchase_order_header_id BIGINT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(15,2 ) NOT NULL,
    total_price NUMERIC(15,2 ) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
)