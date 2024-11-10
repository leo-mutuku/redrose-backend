CREATE TABLE roles(
    role_id BIGINT PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL UNIQUE,
    role_code INT NOT NULL UNIQUE,
    role_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
)

