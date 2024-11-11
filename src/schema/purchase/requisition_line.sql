CREATE requisition_line(
    requisition_line_id BIGSERIAL PRIMARY KEY,
    requisition_header_id BIGINT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(15,2 )  DEFAULT 1.00,
    total_price NUMERIC(15,2 ) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255))