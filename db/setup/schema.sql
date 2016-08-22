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
  id serial PRIMARY KEY,
  user_id int,
  tag_id int
);

DROP TABLE IF EXISTS activity;
CREATE TABLE activity(
  google_id text PRIMARY KEY,
  name text,
  latitude text,
  longitude text,
  phone text,
  address text,
  website text
);

DROP TABLE IF EXISTS activity_tag;
CREATE TABLE activity_tag(
  id serial PRIMARY KEY,
  activity_google_id text,
  tag_id int,
  completed boolean NOT NULL DEFAULT FALSE
);
