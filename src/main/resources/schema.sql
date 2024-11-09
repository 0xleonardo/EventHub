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

CREATE TABLE IF NOT EXISTS event_type
(
    id    IDENTITY,
    name  VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS location
(
    id       VARCHAR(255) PRIMARY KEY,
    address  VARCHAR(255) NOT NULL,
    city     VARCHAR(255) NOT NULL,
    state    VARCHAR(255),
    country  VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS event
(
    id            VARCHAR(255) PRIMARY KEY,
    user_id       VARCHAR(255) NOT NULL,
    event_type_id bigint       NOT NULL,
    location_id   VARCHAR(255) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    image         VARCHAR(255) NOT NULL,
    priority      bigint       NOT NULL,
    datetime_from TIMESTAMP    NOT NULL,
    datetime_to   TIMESTAMP    NOT NULL,
    status        VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_account (id),
    FOREIGN KEY (event_type_id) REFERENCES event_type (id),
    FOREIGN KEY (location_id) REFERENCES location (id)
    );

CREATE TABLE IF NOT EXISTS transaction
(
    id             VARCHAR(255) PRIMARY KEY,
    user_id        VARCHAR(255) NOT NULL,
    event_id       VARCHAR(255) NOT NULL,
    payment_status VARCHAR(255) NOT NULL,
    amount_paid    number       NOT NULL,
    timestamp      TIMESTAMP    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_account (id),
    FOREIGN KEY (event_id) REFERENCES event (id)
    );

CREATE TABLE IF NOT EXISTS ticket
(
    id             VARCHAR(255) PRIMARY KEY,
    event_id       VARCHAR(255)   NOT NULL,
    category       VARCHAR(255)   NOT NULL,
    price          DECIMAL(19, 2) NOT NULL,
    status         VARCHAR(255)   NOT NULL,
    transaction_id UUID,
    activate_id    UUID UNIQUE,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transaction (id),
    FOREIGN KEY (event_id) REFERENCES event (id)
    );
