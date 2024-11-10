CREATE TABLE staff(
    staff_id BIGINT PRIMARY KEY,
    staff_name VARCHAR(255) NOT NULL,
    staff_phone VARCHAR(255) NOT NULL UNIQUE,
    staff_email VARCHAR(255) ,
    staff_national_id VARCHAR(255) NOT NULL UNIQUE,
    staff_department_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     is_active BOOLEAN NOT NULL,
    created_by VARCHAR(255)
)