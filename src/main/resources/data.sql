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