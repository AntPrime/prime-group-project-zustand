const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

// ADDED: Import the rejectNonAdmin middleware to protect admin routes.
const { rejectNonAdmin } = require('../modules/authentication-middleware');

const router = express.Router();

// GET route for search feature for events
router.get('/', (req, res) => {
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
LEFT JOIN "user" AS "pbp_user" ON pbp_user.id = events.play_by_play
LEFT JOIN "user" AS "color_comm_user" ON color_comm_user.id = events.color_commentator
LEFT JOIN "user" AS "camera" ON camera.id = events.camera
LEFT JOIN "user" AS "producer" ON producer.id = events.producer
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
    .then((results) => {
      console.log("results from db", results.rows)
      res.send(results.rows)
    })
    .catch((err) => {
      console.log("error in events.router get", err)
      res.sendStatus(400);
    })
})

// POST to create a new event //?haven't finished adding all fields to create a new event
router.post('/', (req, res) => {
  const { activities_id, date, time, title, school_id, location, channel, notes } = req.body;
  const queryText = `
INSERT INTO "events" ("activities_id", "date", "time", "title", "school_id", "location", "channel", "notes")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
`;
  pool.query(queryText, [activities_id, date, time, title, school_id, location, channel, notes])
    .then((results) => {
      console.log("post to db", results)
      res.send(results)
    })
    .catch((err) => {
      console.log("error in events.router post", err)
      res.sendStatus(400);
    })
})

// ADDED: Admin-only route to get all events.
// This route is accessible at: /api/events/admin when mounted via app.use('/api/events', router);
router.get('/admin', rejectNonAdmin, (req, res) => {
  const queryText = 'SELECT * FROM "events" ORDER BY "id";';
  pool.query(queryText)
    .then((results) => {
      res.send(results.rows);
    })
    .catch((err) => {
      console.error("Error in GET /api/events/admin", err);
      res.sendStatus(500);
    });
});

module.exports = router;
