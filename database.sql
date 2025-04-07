-------------------------------------------------------
--------------------------------------------------
-- START FROM SCRATCH:
DROP TRIGGER IF EXISTS "on_user_update" ON "user";
DROP TABLE IF EXISTS "user";


-------------------------------------------------------
--------------------------------------------------
-- TABLE SCHEMAS:

CREATE TABLE "user" (
    id integer DEFAULT nextval('users_id_seq'::regclass) PRIMARY KEY,
    username character varying(80) NOT NULL UNIQUE,
    password character varying(1000) NOT NULL,
    admin_level integer,
    admin boolean,
    super_admin boolean,
    active boolean
);
 
CREATE TABLE "categories" (
"id" SERIAL PRIMARY KEY,
"activity" VARCHAR (100)
 );
 
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    created_by_id integer REFERENCES "user"(id),
    activities_id integer,
    title character varying(50),
    date date,
    time time without time zone,
    school_id integer REFERENCES schools(id),
    location character varying(100),
    play_by_play integer REFERENCES "user"(id),
    color_commentator integer REFERENCES "user"(id),
    camera integer REFERENCES "user"(id),
    producer integer REFERENCES "user"(id),
    channel character varying(50),
    notes character varying(100),
    play_by_play_attended boolean DEFAULT false,
    color_commentator_attended boolean DEFAULT false,
    camera_attended boolean DEFAULT false,
    producer_attended boolean DEFAULT false
);
 
 CREATE TABLE "schools" (
"id" SERIAL PRIMARY KEY,
"name" VARCHAR (100),
"address" VARCHAR(100)
 );
-------------------------------------------------------
--------------------------------------------------
-- SEED DATA:

INSERT INTO "user" ("username","password","admin", "super_admin", "active")
VALUES 
('Aunika','egg', true, true, true),
('Anthony','egg', true, false, true),
('Abdi','egg',false, false, true),
('Aden','egg',false, false, true),
('Brad','egg',false, false, true),
('Ru','egg',false, false, true),
('Gregg','egg',false, false, true);

SELECT * FROM "user";

INSERT INTO "categories" ("activity")
VALUES 
('Basketball'),
('Tennis'),
('Football'),
('Lacrosse'),
('Hockey');

SELECT * FROM "categories";

INSERT INTO "events" ("activities_id","title", "date","time","school_id","location","play_by_play","color_commentator","camera","producer","channel","notes")
VALUES 
('1','Event title1', '2025-03-13','14:30:00',1,'Elks',NULL, 5, 6, 4, 'RogersTv','Look out for pickleballers'),
('2', 'Event title2', '2025-02-13','11:00:00',1,'Target Field', 1, 5, NULL, 3, 'RogersTv','gonna get crazy'),
('3', 'Event title3','2025-03-13','12:30:00',2,'Target Field',NULL, 5, 1, NULL, 'LeafsTv','touchdown'),
('4','Event title4', '2025-04-03','16:30:00',2,'The North Field',2, 5, 1, 7, 'ZTV','goal!'),
('5', 'Event title5','2025-03-13','12:30:00',3,'Target Field',3, 5, 1, NULL, 'ERTv','goal!');

SELECT * FROM "events";

INSERT INTO "schools" ("name")
VALUES ('Albert Lea'),('Faibault'),('Northfield');

SELECT * FROM "schools";

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
