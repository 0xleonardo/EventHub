insert into authority (authority_type)
values ('ROLE_ORGANIZER');

insert into authority (authority_type)
values ('ROLE_USER');

insert into authority (authority_type)
values ('ROLE_ADMIN');

INSERT INTO user_account (id, username, password, email, image_url, about, authority_id)
VALUES ('89e85f2d-3b2b-4a0a-8b68-5d62225e8a98', 'admin',
        '$2a$10$TYExkmI7uVXXVadrdTTa0OQTOorVV32jTjK.Py2BPQjEojbAx96yy',
        'admin@eventhub.com', 'https://iili.io/HZcJobV.jpg', 'I am admin', 3);

INSERT INTO user_account (id, username, password, email, image_url, about, authority_id)
VALUES ('89e85f2d-2b2b-4a0a-8b58-5d62225e8a98', 'organizer',
        '$2a$10$TYExkmI7uVXXVadrdTTa0OQTOorVV32jTjK.Py2BPQjEojbAx96yy',
        'organizer1@email.com', 'https://iili.io/HtSlWmJ.png', 'This is a sample organizer', 1);

INSERT INTO user_account (id, username, password, email, image_url, about, authority_id)
VALUES ('89e85f2d-2b2b-4a0a-8b58-5e62225e8a98', 'organizer2',
        '$2a$10$TYExkmI7uVXXVadrdTTa0OQTOorVV32jTjK.Py2BPQjEojbAx96yy',
        'organizer2@email.com', 'https://iili.io/HtSlM5g.png', 'This is a sample organizer2', 1);

INSERT INTO user_account (id, username, password, email, image_url, first_name, last_name, authority_id)
VALUES ('89e85f2d-2b2b-4a0a-8b58-5d62225e8b98', 'user', '$2a$10$TYExkmI7uVXXVadrdTTa0OQTOorVV32jTjK.Py2BPQjEojbAx96yy',
        'user@email.com', 'https://iili.io/HZcJobV.jpg', 'Marko', 'Horvat', 2);

INSERT INTO event_type (name, image)
VALUES ('Music Festival', 'https://iili.io/HZz289n.jpg');

INSERT INTO event_type (name, image)
VALUES ('DJ Party', 'https://iili.io/HZz2k8X.jpg');

INSERT INTO event_type (name, image)
VALUES ('Concert', 'https://iili.io/HZzobNS.jpg');

----------------------------------------------------------------

INSERT INTO location (id, address, city, state, country, zip_code)
VALUES ('d30dd879-f8a2-4a68-995e-08db6b3f75a8', '123 Main Street', 'New York', 'NY', 'USA', '10001');

INSERT INTO event (id, user_id, name, image, description, priority, datetime_from, datetime_to,
                   event_type_id,
                   location_id, status)
VALUES ('ebfdfe4c-5bfa-4f34-b860-9b3b5d38ac57', '89e85f2d-2b2b-4a0a-8b58-5d62225e8a98', 'Summer Music Festival',
        'https://iili.io/HZxeXuR.jpg',
        'The Summer Music Festival is back again!
    Get ready to enjoy three days of non-stop music, fun, and sunshine.

    Line Up:
    - The Cool Cats: An indie rock band with a unique sound and a legion of followers.
    - DJ Spins: Known for energetic sets that will keep you dancing all night long.
    - And many more talented local and international artists!

    What''s More?
    Along with great music, we''re hosting a variety of food and drink stalls.
    From local delicacies to international cuisines, there''s something for everyone.

    Also, don''t forget to check out the arts and crafts stalls, games, and other fun activities.

    We can''t wait to see you there!
    It''s more than just a festival - it''s a celebration of music, culture, and summer fun.

    Date: August 12-14, 2023
    Location: Central Park, New York

    Bring your friends, bring your energy, and most importantly, bring your love for music!', 1,
        '2025-08-14 15:00:00', '2025-08-14 19:00:00', 1, 'd30dd879-f8a2-4a68-995e-08db6b3f75a8', 'ACTIVE');

INSERT INTO transaction(id, user_id, amount_paid, event_id, payment_status, timestamp)
VALUES ('89e85f2d-2b2b-4b0a-8b58-5d62225e8b98', '89e85f2d-2b2b-4a0a-8b58-5d62225e8b98', 420.00,
        'ebfdfe4c-5bfa-4f34-b860-9b3b5d38ac57', 'PROCESSED', '2022-11-30 12:30:00');

INSERT INTO ticket(id, event_id, category, price, status, transaction_id, activate_id)
VALUES ('ebfdfe4e-5bfa-4f34-b860-9b3b5d38ac57', 'ebfdfe4c-5bfa-4f34-b860-9b3b5d38ac57', 'VIP', 200.00, 'SOLD',
        '89e85f2d-2b2b-4b0a-8b58-5d62225e8b98', '89e85f2d-2b2b-4b0a-8d58-5d62225e9b98');

INSERT INTO ticket(id, event_id, category, price, status, transaction_id, activate_id)
VALUES ('ebfdfe4d-5bfa-4f34-b860-9b3b5d38ac57', 'ebfdfe4c-5bfa-4f34-b860-9b3b5d38ac57', 'VIP', 200.00, 'SOLD',
        '89e85f2d-2b2b-4b0a-8b58-5d62225e8b98', '89e85f2d-2b2b-4b0a-8c58-5d62225e9b98');

INSERT INTO ticket(id, event_id, category, price, status)
VALUES ('ebfdfe4f-5bfa-4f34-b860-9b3b5d38ac57', 'ebfdfe4c-5bfa-4f34-b860-9b3b5d38ac57', 'Regular', 100.00, 'FREE');

---------------------------------------------------------------------------------------------------

INSERT INTO location (id, address, city, state, country, zip_code)
VALUES ('d30ed879-f8a2-4a68-995e-08db6b3f75a8', '321 Main Street', 'Zagreb', 'Grad Zagreb', 'Croatia', '10001');

INSERT INTO event (id, user_id, name, image, description, priority, datetime_from, datetime_to,
                   event_type_id,
                   location_id, status)
VALUES ('ebfdfe4c-5bfa-4f34-b860-9c3b5d38ac57', '89e85f2d-2b2b-4a0a-8b58-5e62225e8a98', 'Aquarius Summer Mix',
        'https://iili.io/HZxeVyv.jpg',
        'A music festival featuring top artists', 1,
        '2023-12-02 12:00:00', '2023-12-02 20:00:00', 2, 'd30ed879-f8a2-4a68-995e-08db6b3f75a8', 'ENDED');

INSERT INTO ticket(id, event_id, category, price, status)
VALUES ('ebfdfe4e-5bfb-4f34-b860-9b3b5d38ac57', 'ebfdfe4c-5bfa-4f34-b860-9c3b5d38ac57', 'VIP', 200.00, 'FREE');

INSERT INTO ticket(id, event_id, category, price, status)
VALUES ('ebfdfe4d-5bfc-4f34-b860-9b3b5d38ac57', 'ebfdfe4c-5bfa-4f34-b860-9c3b5d38ac57', 'VIP', 200.00, 'FREE');

INSERT INTO ticket(id, event_id, category, price, status)
VALUES ('ebfdfe4f-5bfd-4f34-b860-9b3b5d38ac57', 'ebfdfe4c-5bfa-4f34-b860-9c3b5d38ac57', 'Regular', 50.00, 'FREE');

INSERT INTO ticket(id, event_id, category, price, status)
VALUES ('ebfdfe4e-5bfe-4f34-b860-9b3b5d38ac57', 'ebfdfe4c-5bfa-4f34-b860-9c3b5d38ac57', 'Regular', 50.00, 'FREE');

INSERT INTO ticket(id, event_id, category, price, status)
VALUES ('ebfdfe4e-5bff-4f34-b860-9b3b5d38ac57', 'ebfdfe4c-5bfa-4f34-b860-9c3b5d38ac57', 'Regular', 50.00, 'FREE');

INSERT INTO user_account (id, username, password, email, image_url, about, authority_id)
VALUES ('89e85f2d-3b2b-4a0a-8b68-5d62225e8a99', 'organizer3',
        '$2a$10$TYExkmI7uVXXVadrdTTa0OQTOorVV32jTjK.Py2BPQjEojbAx96yy', 'organizer3@email.com',
        'https://iili.io/HtSlCs2.jpg', 'Sample organizer 3', 1);

INSERT INTO user_account (id, username, password, email, image_url, about, authority_id)
VALUES ('89e85f2d-3b2b-4a0a-8b68-5d62225e8a90', 'organizer4',
        '$2a$10$TYExkmI7uVXXVadrdTTa0OQTOorVV32jTjK.Py2BPQjEojbAx96yy', 'organizer4@email.com',
        'https://iili.io/HtSl7zx.jpg', 'Sample organizer 4', 1);


INSERT INTO user_account (id, username, password, email, image_url, first_name, last_name, authority_id)
VALUES ('89e85f2d-3b2b-4a0a-8b68-5d62225e8b00', 'ananas',
        '$2a$10$TYExkmI7uVXXVadrdTTa0OQTOorVV32jTjK.Py2BPQjEojbAx96yy',
        'user2@email.com', 'https://iili.io/HZcJobB.jpg', 'Anna', 'Smith', 2);

INSERT INTO user_account (id, username, password, email, image_url, first_name, last_name, authority_id)
VALUES ('89e85f2d-3b2b-4a0a-8b68-5d62225e8b01', 'john_doe',
        '$2a$10$TYExkmI7uVXXVadrdTTa0OQTOorVV32jTjK.Py2BPQjEojbAx96yy',
        'user3@email.com', 'https://iili.io/HZcJobB.jpg', 'John', 'Doe', 2);


INSERT INTO location (id, address, city, state, country, zip_code)
VALUES ('d30dd881-f8a2-4a68-995e-08db6b3f75a9', '456 Park Avenue', 'New York', 'NY', 'USA', '10002');

INSERT INTO event (id, user_id, name, image, description, priority, datetime_from, datetime_to, event_type_id,
                   location_id, status)
VALUES ('ebfdfe4d-5bfa-4f34-b861-9b3b5d38ac58', '89e85f2d-3b2b-4a0a-8b68-5d62225e8a99', 'Winter Fest',
        'https://iili.io/HtSaM41.jpg', 'An amazing winter festival!', 2, '2024-12-01 12:00:00', '2024-12-01 18:00:00',
        1, 'd30dd881-f8a2-4a68-995e-08db6b3f75a9', 'ACTIVE');

INSERT INTO transaction(id, user_id, amount_paid, event_id, payment_status, timestamp)
VALUES ('e9e85f2d-4b2b-5a0a-8c68-5a62225e9a99', '89e85f2d-3b2b-4a0a-8b68-5d62225e8b00', 50.00,
        'ebfdfe4d-5bfa-4f34-b861-9b3b5d38ac58', 'PROCESSED', '2024-11-20 10:30:00');

INSERT INTO ticket(id, event_id, category, price, status, transaction_id)
VALUES ('ebfdfe5d-5bfa-4f34-b861-9b3b5d38ac59', 'ebfdfe4d-5bfa-4f34-b861-9b3b5d38ac58', 'Regular', 50.00, 'SOLD',
        'e9e85f2d-4b2b-5a0a-8c68-5a62225e9a99');

INSERT INTO ticket(id, event_id, category, price, status, transaction_id)
VALUES ('ebfdfe5d-5bfa-4f32-b861-9b3b5d38ac59', 'ebfdfe4d-5bfa-4f34-b861-9b3b5d38ac58', 'Regular', 50.00, 'FREE',
        'e9e85f2d-4b2b-5a0a-8c68-5a62225e9a99');

INSERT INTO ticket(id, event_id, category, price, status, transaction_id)
VALUES ('ebfdfe5d-5bfa-4f31-b861-9b3b5d38ac59', 'ebfdfe4d-5bfa-4f34-b861-9b3b5d38ac58', 'Regular', 50.00, 'FREE',
        'e9e85f2d-4b2b-5a0a-8c68-5a62225e9a99');

INSERT INTO location (id, address, city, state, country, zip_code)
VALUES ('d30dd882-f8a2-4a68-995e-08db6b3f75b0', '123 Downtown Street', 'Los Angeles', 'CA', 'USA', '90001');

INSERT INTO event (id, user_id, name, image, description, priority, datetime_from, datetime_to, event_type_id,
                   location_id, status)
VALUES ('ebfdfe5d-5bfa-4f34-b861-9b3b5d38ac59', '89e85f2d-3b2b-4a0a-8b68-5d62225e8a90', 'LA Music Festival',
        'https://iili.io/HtSaW3F.jpg', 'Experience the best music!', 3, '2025-10-15 14:00:00', '2025-10-15 22:00:00', 1,
        'd30dd882-f8a2-4a68-995e-08db6b3f75b0', 'ACTIVE');

INSERT INTO transaction(id, user_id, amount_paid, event_id, payment_status, timestamp)
VALUES ('e9e85f3d-4b2b-5a0a-8c68-5a62225e9b00', '89e85f2d-3b2b-4a0a-8b68-5d62225e8b01', 150.00,
        'ebfdfe5d-5bfa-4f34-b861-9b3b5d38ac59', 'PROCESSED', '2024-09-10 15:45:00');

INSERT INTO ticket(id, event_id, category, price, status, transaction_id)
VALUES ('ebfdfe6d-5bfa-4f34-b861-9b3b5d38ac60', 'ebfdfe5d-5bfa-4f34-b861-9b3b5d38ac59', 'VIP', 150.00, 'SOLD',
        'e9e85f3d-4b2b-5a0a-8c68-5a62225e9b00');

INSERT INTO location (id, address, city, state, country, zip_code)
VALUES ('d30dd883-f8a2-4a68-995e-08db6b3f75b1', '789 Beachside Lane', 'Miami', 'FL', 'USA', '33101');

INSERT INTO event (id, user_id, name, image, description, priority, datetime_from, datetime_to, event_type_id,
                   location_id, status)
VALUES ('ebfdfe6d-5bfa-4f34-b861-9b3b5d38ac60', '89e85f2d-3b2b-4a0a-8b68-5d62225e8a99', 'Miami Beach Party',
        'https://iili.io/HtSaGEP.jpg', 'Party by the beach!', 4, '2025-08-25 16:00:00', '2025-08-26 02:00:00', 2,
        'd30dd883-f8a2-4a68-995e-08db6b3f75b1', 'ACTIVE');

INSERT INTO transaction(id, user_id, amount_paid, event_id, payment_status, timestamp)
VALUES ('e9e85f4d-4b2b-5a0a-8c68-5a62225e9b01', '89e85f2d-3b2b-4a0a-8b68-5d62225e8b00', 75.00,
        'ebfdfe6d-5bfa-4f34-b861-9b3b5d38ac60', 'PROCESSED', '2024-08-01 14:00:00');

INSERT INTO ticket(id, event_id, category, price, status, transaction_id)
VALUES ('ebfdfe7d-5bfa-4f34-b861-9b3b5d38ac61', 'ebfdfe6d-5bfa-4f34-b861-9b3b5d38ac60', 'Regular', 75.00, 'SOLD',
        'e9e85f4d-4b2b-5a0a-8c68-5a62225e9b01');

INSERT INTO location (id, address, city, state, country, zip_code)
VALUES ('d30dd884-f8a2-4a68-995e-08db6b3f75b2', '456 Mountain Top', 'Denver', 'CO', 'USA', '80201');

INSERT INTO event (id, user_id, name, image, description, priority, datetime_from, datetime_to, event_type_id,
                   location_id, status)
VALUES ('ebfdfe7e-5bfa-4f34-b861-9b3b5d38ac62', '89e85f2d-3b2b-4a0a-8b68-5d62225e8a99', 'Denver Rock Concert',
        'https://iili.io/HtSalhQ.webp', 'Rock on the mountain top!', 2, '2025-09-05 18:00:00', '2025-09-06 01:00:00', 1,
        'd30dd884-f8a2-4a68-995e-08db6b3f75b2', 'ACTIVE');

INSERT INTO transaction(id, user_id, amount_paid, event_id, payment_status, timestamp)
VALUES ('e9e85f5d-4b2b-5a0a-8c68-5a62225e9b02', '89e85f2d-3b2b-4a0a-8b68-5d62225e8b01', 200.00,
        'ebfdfe7e-5bfa-4f34-b861-9b3b5d38ac62', 'PROCESSED', '2024-08-20 16:00:00');

INSERT INTO ticket(id, event_id, category, price, status, transaction_id)
VALUES ('ebfdfe8e-5bfa-4f34-b861-9b3b5d38ac63', 'ebfdfe7e-5bfa-4f34-b861-9b3b5d38ac62', 'VIP', 200.00, 'SOLD',
        'e9e85f5d-4b2b-5a0a-8c68-5a62225e9b02');

INSERT INTO location (id, address, city, state, country, zip_code)
VALUES ('d30dd885-f8a2-4a68-995e-08db6b3f75b3', '159 Central Park', 'New York', 'NY', 'USA', '10001');

INSERT INTO event (id, user_id, name, image, description, priority, datetime_from, datetime_to, event_type_id,
                   location_id, status)
VALUES ('ebfdfe8f-5bfa-4f34-b861-9b3b5d38ac64', '89e85f2d-3b2b-4a0a-8b68-5d62225e8a90', 'Central Park Festival',
        'https://iili.io/HtSa5Yu.jpg', 'Festival in the heart of NY!', 1, '2025-09-20 10:00:00', '2025-09-20 21:00:00',
        2, 'd30dd885-f8a2-4a68-995e-08db6b3f75b3', 'ACTIVE');

INSERT INTO transaction(id, user_id, amount_paid, event_id, payment_status, timestamp)
VALUES ('e9e85f6d-4b2b-5a0a-8c68-5a62225e9b03', '89e85f2d-3b2b-4a0a-8b68-5d62225e8b01', 80.00,
        'ebfdfe8f-5bfa-4f34-b861-9b3b5d38ac64', 'PROCESSED', '2024-09-01 11:30:00');

INSERT INTO ticket(id, event_id, category, price, status, transaction_id)
VALUES ('ebfdfe9e-5bfa-4f34-b861-9b3b5d38ac65', 'ebfdfe8f-5bfa-4f34-b861-9b3b5d38ac64', 'Regular', 80.00, 'SOLD',
        'e9e85f6d-4b2b-5a0a-8c68-5a62225e9b03');

