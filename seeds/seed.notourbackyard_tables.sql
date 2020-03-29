BEGIN;

TRUNCATE
  cleanups,
  users,
  region,
  countries;

INSERT INTO countries (country_name)
VALUES
  ('Mongolia'),
  ('United States');

INSERT INTO region (region_name, country)
VALUES
  ('hovsgol', 1),
  ('California', 2),
  ('Arizona', 2);

INSERT INTO users (display_name, email, password, home_country)
VALUES
  ('oogii', 'oogiisar@gmail.com', '$2a$12$G0o6CiEp1Eo2WxajTlnAVODIvT5YgoKToy7RuENsBqUe7r0AnsI9C', 1),
  ('brian', 'brian@gmail.com', '$2a$12$G0o6CiEp1Eo2WxajTlnAVODIvT5YgoKToy7RuENsBqUe7r0AnsI9C', 2);

INSERT INTO cleanups (location, user_name, type_of_trash, quantity)
VALUES
  (1, 1, 'plastic', 87),
  (2, 2, 'paper', 33),
  (3, 2, 'rubber', 4);

COMMIT;