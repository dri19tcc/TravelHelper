DROP TABLE IF EXISTS users;
CREATE TABLE users(
  id serial PRIMARY KEY,
  name text,
  email text,
  image_url text
);

DROP TABLE IF EXISTS tag;
CREATE TABLE tag(
  id serial PRIMARY KEY,
  name text,
  modified_date date
);

DROP TABLE IF EXISTS activity;
CREATE TABLE activity(
  id serial PRIMARY KEY
  -- More will go here, still deciding what
);

DROP TABLE IF EXISTS user_tag;
CREATE TABLE activity(
  id serial PRIMARY KEY,
  user_id int,
  tag_id int
);

DROP TABLE IF EXISTS activity_tag;
CREATE TABLE activity(
  id serial PRIMARY KEY,
  activity_id int,
  tag_id int
);
