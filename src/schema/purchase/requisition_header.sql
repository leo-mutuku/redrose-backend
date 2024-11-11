CREATE TABLE requisition_header(
    requisition_header_id BIGSERIAL PRIMARY KEY,
    requisition_number BIGINT NOT NULL UNIQUE,
    staff_id INT NOT NULL,
    total_price NUMERIC(15,2 ) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
)