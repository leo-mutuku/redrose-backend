
-- Step 1: Create a sequence starting at 100
CREATE SEQUENCE waitstaff_id_seq START 100;

CREATE TABLE waitstaff(
    waitstaff_id BIGINT PRIMARY KEY DEFAULT nextval('waitstaff_id_seq'),
    waitstaff_name VARCHAR(255) NOT NULL,
    waitstaff_phone VARCHAR(255) NOT NULL UNIQUE,
    waitstaff_national_id VARCHAR(255) NOT NULL UNIQUE,
    balance NUMERIC(15,2 ) DEFAULT 0.00,
    pin INT NOT NULL CHECK (pin >= 100 AND pin <= 999),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL,
    created_by VARCHAR(255)
)