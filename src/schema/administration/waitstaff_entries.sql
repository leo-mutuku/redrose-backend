CREATE TABLE waitstaff_entries(
    waitstaff_entry_id BIGINT PRIMARY KEY,
    waitstaff_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    credited NUMERIC(15,2 ) NOT NULL,
    debited NUMERIC(15,2 ) NOT NULL,
    balance NUMERIC(15,2 ) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
)