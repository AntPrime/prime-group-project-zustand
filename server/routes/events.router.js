const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

//GET route for search feature for events
router.get('/', (req, res)=>{
  const searchQuery = req.query.q || '';
  const queryText = ` 
SELECT events.id AS "events id", 
events.title AS "title",
categories.activity AS "activity", 
events.date AS "date",
events.time AS "time",
events.location AS "location",  
schools.name AS "school name", 
pbp_user.username AS "play-by-play",
color_comm_user.username AS "color comm.",
camera.username AS "camera",
producer.username AS "producer",
events.channel AS "channel", 
events.notes AS "notes"
FROM "events"
LEFT JOIN "categories" ON events.activities_id = categories.id
LEFT JOIN "users" AS "pbp_user" ON pbp_user.id = events.play_by_play
LEFT JOIN "users" AS "color_comm_user" ON color_comm_user.id = events.color_commentator
LEFT JOIN "users" AS "camera" ON camera.id = events.camera
LEFT JOIN "users" AS "producer" ON producer.id = events.producer
LEFT JOIN "schools" ON schools.id = events.school_id 
WHERE events.title ILIKE $1
OR categories.activity ILIKE $1
OR TO_CHAR(events.date, 'YYYY-MM-DD') ILIKE $1
OR events.location ILIKE $1
OR schools.name ILIKE $1
OR pbp_user.username ILIKE $1
OR color_comm_user.username ILIKE $1
OR camera.username ILIKE $1
OR producer.username ILIKE $1
OR events.channel ILIKE $1;`;
const values = [`%${searchQuery}%`]
  pool.query(queryText, values)
  .then((results)=>{
    console.log("results from db", results.rows)
    res.send(results.rows)
  })
  .catch((err)=>{
    console.log("error in events.router get", err)
    res.sendStatus(400);
  })
})

//POST to create a new event //?haven't finished adding all fields to create a new event
router.post('/', (req, res)=>{
  const {activities_id, title, school_id, location, channel, notes} = req.body;
  const queryText = `
INSERT INTO "events" ("activities_id", "title","school_id","location", "channel", "notes")
VALUES ($1, $2, $3, $4, $5, $6);
`;
  pool.query(queryText,[activities_id, title, school_id, location, channel, notes])
  .then((results)=>{
    console.log("post to db", results)
    res.send(results)
  })
  .catch((err)=>{
    console.log("error in events.router post", err)
    res.sendStatus(400);
  })
})

module.exports = router;
