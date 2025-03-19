-------------------------------------------------------
--------------------------------------------------
-- START FROM SCRATCH:
DROP TRIGGER IF EXISTS "on_user_update" ON "user";
DROP TABLE IF EXISTS "user";


-------------------------------------------------------
--------------------------------------------------
-- TABLE SCHEMAS:

CREATE TABLE "users"(
"id" SERIAL PRIMARY KEY,
"username" VARCHAR (80) UNIQUE NOT NULL,
"password" VARCHAR (1000) NOT NULL,
"admin" BOOLEAN,
"super_admin" BOOLEAN,
"active" BOOLEAN
 );
  
CREATE TABLE "categories" (
"id" SERIAL PRIMARY KEY,
"activity" VARCHAR (100)
 );
 
 CREATE TABLE "events" (
"id" SERIAL PRIMARY KEY,
"activities_id" INTEGER,
"title" VARCHAR(50),
"date" DATE,
"time" TIME,
"home_team" VARCHAR (100),
"away_team" VARCHAR (100),
"location" VARCHAR (100),
"play_by_play" INTEGER,
"color_commentator" INTEGER,
"camera" INTEGER,
"producer" INTEGER,
"channel" VARCHAR (50),
"notes" VARCHAR (100)
 );

-------------------------------------------------------
--------------------------------------------------
-- SEED DATA:

INSERT INTO "users" ("username","admin", "super_admin", "active")
VALUES 
('Aunika', true, true, true),
('Anthony', true, false, true),
('Abdi',false, false, true),
('Aden',false, false, true),
('Brad',false, false, true),
('Ru',false, false, true),
('Gregg',false, false, true);

SELECT * FROM "users";

INSERT INTO "categories" ("activity")
VALUES 
('Basketball'),
('Tennis'),
('Football'),
('Lacrosse'),
('Hockey');

SELECT * FROM "categories";

INSERT INTO "events" ("activities_id","title", "date","time","home_team","away_team","location","play_by_play","color_commentator","camera","producer","channel","notes")
VALUES 
('1','Event title1', '2025-03-13','14:30:00','Elk River','Rogers','Elks',NULL, 5, 6, 4, 'RogersTv','Look out for pickleballers'),
('2', 'Event title2', '2025-02-13','11:00:00','Maple Grove','Rogers','Target Field', 1, 5, NULL, 3, 'RogersTv','gonna get crazy'),
('3', 'Event title3','2025-03-13','12:30:00','Elk River','Maple Grove','Target Field',NULL, 5, 1, NULL, 'LeafsTv','touchdown'),
('4','Event title4', '2025-04-03','16:30:00','Northfield','Zimmerman','The North Field',2, 5, 1, 7, 'ZTV','goal!'),
('5', 'Event title5','2025-03-13','12:30:00','Elk River','Maple Grove','Target Field',3, 5, 1, NULL, 'ERTv','goal!');

SELECT * FROM "events";
-------------------------------------------------------
--------------------------------------------------
-- AUTOMAGIC UPDATED_AT:

-- Did you know that you can make and execute functions
-- in PostgresQL? Wild, right!? I'm not making this up. Here
-- is proof that I am not making this up:
  -- https://x-team.com/blog/automatic-timestamps-with-postgresql/

-- Create a function that sets a row's updated_at column
-- to NOW():
CREATE OR REPLACE FUNCTION set_updated_at_to_now() -- 👈
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger on the user table that will execute
-- the set_update_at_to_now function on any rows that
-- have been touched by an UPDATE query:
CREATE TRIGGER on_user_update
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();
