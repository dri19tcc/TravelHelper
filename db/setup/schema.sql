DROP TABLE IF EXISTS users;
CREATE TABLE users(
  id serial PRIMARY KEY,
  name text,
  google_id text,
  image_url text
);

DROP TABLE IF EXISTS tag; --This is the trip as a whole
CREATE TABLE tag(
  id serial PRIMARY KEY,
  name text,
  modified_date date
);

DROP TABLE IF EXISTS user_tag; --Joining table for a users trip
CREATE TABLE user_tag(
  user_id int,
  tag_id int
);

DROP TABLE IF EXISTS activity;
CREATE TABLE activity(
  id serial PRIMARY KEY,
  name text,
  latitude text,
  longitude text,
  phone text,
  address text,
  website text,
  photo_url text,
  google_id text
);

DROP TABLE IF EXISTS activity_tag;
CREATE TABLE activity_tag(
  activity_google_id int,
  tag_id int
);
