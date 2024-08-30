CREATE TABLE IF NOT EXISTS measurements (
    measure_uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    measure_datetime DATETIME NOT NULL,
    measure_type VARCHAR(255) NOT NULL,
    measure_value INT NOT NULL,
    has_confirmed BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(255) NOT NULL,
    customer_code VARCHAR(50) NOT NULL
);