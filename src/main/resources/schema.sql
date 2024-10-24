CREATE TABLE IF NOT EXISTS authority
(
    id             IDENTITY,
    authority_type VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_account
(
    id           VARCHAR(255) PRIMARY KEY,
    username     VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(250) NOT NULL,
    email        VARCHAR(250) NOT NULL UNIQUE,
    image_url    VARCHAR(255),
    authority_id BIGINT,
    first_name   VARCHAR(255),
    last_name    VARCHAR(255),
    about        TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authority_id) REFERENCES authority (id)
);
