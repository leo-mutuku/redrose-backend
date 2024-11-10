CREATE TABLE staff_department(
    staff_department_id BIGINT PRIMARY KEY,
    staff_department_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
)