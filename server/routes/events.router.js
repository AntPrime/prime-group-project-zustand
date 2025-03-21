const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

//GET route for search feature for events
router.get('/', (req, res)=>{
  const searchQuery = req.query.q || '';
  const categoryFilters = req.query.category ? Array.isArray(req.query.category) ? req.query.category : [req.query.category] : [];
  const schoolFilters = req.query.school ? Array.isArray(req.query.school) ? req.query.school : [req.query.school] : [];
  const eventTypeFilters = req.query.eventType ? Array.isArray(req.query.eventType) ? req.query.eventType : [req.query.eventType] : [];
  
  let queryText = ` 
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
    events.notes AS "notes",
    events.event_type AS "event type"
    FROM "events"
    LEFT JOIN "categories" ON events.activities_id = categories.id
    LEFT JOIN "user" AS "pbp_user" ON pbp_user.id = events.play_by_play
    LEFT JOIN "user" AS "color_comm_user" ON color_comm_user.id = events.color_commentator
    LEFT JOIN "user" AS "camera" ON camera.id = events.camera
    LEFT JOIN "user" AS "producer" ON producer.id = events.producer
    LEFT JOIN "schools" ON schools.id = events.school_id 
    WHERE 1=1`;
  
  const values = [];
  let valueIndex = 1;
  
  // Add search query condition if provided
  if (searchQuery) {
    queryText += `
      AND (events.title ILIKE $${valueIndex}
      OR categories.activity ILIKE $${valueIndex}
      OR TO_CHAR(events.date, 'YYYY-MM-DD') ILIKE $${valueIndex}
      OR events.location ILIKE $${valueIndex}
      OR schools.name ILIKE $${valueIndex}
      OR pbp_user.username ILIKE $${valueIndex}
      OR color_comm_user.username ILIKE $${valueIndex}
      OR camera.username ILIKE $${valueIndex}
      OR producer.username ILIKE $${valueIndex}
      OR events.channel ILIKE $${valueIndex})`;
    values.push(`%${searchQuery}%`);
    valueIndex++;
  }
  
  // Add category filters if provided
  if (categoryFilters.length > 0) {
    queryText += ` AND categories.activity IN (`;
    categoryFilters.forEach((category, index) => {
      queryText += index === 0 ? `$${valueIndex}` : `, $${valueIndex}`;
      values.push(category);
      valueIndex++;
    });
    queryText += `)`;
  }
  
  // Add school filters if provided
  if (schoolFilters.length > 0) {
    queryText += ` AND schools.name IN (`;
    schoolFilters.forEach((school, index) => {
      queryText += index === 0 ? `$${valueIndex}` : `, $${valueIndex}`;
      values.push(school);
      valueIndex++;
    });
    queryText += `)`;
  }
  
  // Add event type filters if provided
  if (eventTypeFilters.length > 0) {
    queryText += ` AND events.event_type IN (`;
    eventTypeFilters.forEach((type, index) => {
      queryText += index === 0 ? `$${valueIndex}` : `, $${valueIndex}`;
      values.push(type);
      valueIndex++;
    });
    queryText += `)`;
  }
  
  pool.query(queryText, values)
    .then((results) => {
      console.log("results from db", results.rows);
      res.send(results.rows);
    })
    .catch((err) => {
      console.log("error in events.router get", err);
      res.sendStatus(400);
    });
})

//GET all events
router.get('/all', (req, res) => {
  const queryText = 'SELECT * FROM "events" ORDER BY "date" DESC';
  pool.query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('Error getting events', err);
      res.sendStatus(500);
    });
});

//POST to create a new event //?haven't finished adding all fields to create a new event
router.post('/', (req, res)=>{
  const event = req.body;
  const queryText = `INSERT INTO "events" 
    ("activities_id", "title", "date", "time", "school_id", "location", "channel", "notes")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`;
  
  pool.query(queryText, [
    event.activities_id,
    event.title,
    event.date,
    event.time,
    event.school_id,
    event.location,
    event.channel,
    event.notes
  ])
    .then((result) => {
      res.status(201).send(result.rows[0]);
    })
    .catch((err) => {
      console.log('Error creating event', err);
      res.sendStatus(500);
    });
})

// DELETE an event
router.delete('/:id', (req, res) => {
  const queryText = 'DELETE FROM "events" WHERE "id" = $1';
  pool.query(queryText, [req.params.id])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log('Error deleting event', err);
      res.sendStatus(500);
    });
});

// UPDATE an event
router.put('/:id', (req, res) => {
  const event = req.body;
  const queryText = `
    UPDATE "events" 
    SET "activities_id" = $1, 
        "title" = $2, 
        "date" = $3, 
        "time" = $4, 
        "school_id" = $5, 
        "location" = $6, 
        "channel" = $7, 
        "notes" = $8
    WHERE "id" = $9
    RETURNING *`;
  
  pool.query(queryText, [
    event.activities_id,
    event.title,
    event.date,
    event.time,
    event.school_id,
    event.location,
    event.channel,
    event.notes,
    req.params.id
  ])
    .then((result) => {
      res.send(result.rows[0]);
    })
    .catch((err) => {
      console.log('Error updating event', err);
      res.sendStatus(500);
    });
});

module.exports = router;
