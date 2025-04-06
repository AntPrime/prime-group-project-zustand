const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');

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
schools.name AS "schoolname", 
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
    .then(result => {
      // Transform raw data to enforce consistent naming
      const cleanedEvents = result.rows.map(event => ({
        id: event.event_id,
        title: event.title,
        activity: event.activity,
        date: event.date,  // Already formatted as YYYY-MM-DD
        time: event.time,   // Already formatted as HH:MM
        location: event.location,
        school_name: event.school_name,
        channel: event.channel,
        notes: event.notes,
        play_by_play: event.play_by_play,
        color_commentator: event.color_commentator,
        camera: event.camera,
        producer: event.producer,
        play_by_play_username: event.play_by_play_username,
        color_commentator_username: event.color_commentator_username,
        camera_username: event.camera_username,
        producer_username: event.producer_username
      }));
      
      res.status(200).json(cleanedEvents);
    })
    .catch(err => {
      console.error('[GET /clean Error]', err);
      res.status(500).json({ error: 'Database error' });
    });
});

//GET ROUTE to map through and select roles on events: 
router.get('/all', (req, res) => {
  const queryText = `
    SELECT 
      events.id AS event_id,
      events.title,
      categories.activity,
      TO_CHAR(events.date, 'YYYY-MM-DD') AS date,
      TO_CHAR(events.time, 'HH12:MI') AS time,
      events.location,
      schools.name AS school_name,
      events.channel,
      events.notes,
      events.play_by_play,
      events.color_commentator,
      events.camera,
      events.producer,
      events.play_by_play_attended,  
      events.color_commentator_attended,  
      events.camera_attended,  
      events.producer_attended,  
      pbp_user.username AS play_by_play_username,
      cc_user.username AS color_commentator_username,
      cam_user.username AS camera_username,
      prod_user.username AS producer_username
    FROM events
    LEFT JOIN categories ON events.activities_id = categories.id
    LEFT JOIN schools ON events.school_id = schools.id
    LEFT JOIN "user" AS pbp_user ON events.play_by_play = pbp_user.id
    LEFT JOIN "user" AS cc_user ON events.color_commentator = cc_user.id
    LEFT JOIN "user" AS cam_user ON events.camera = cam_user.id
    LEFT JOIN "user" AS prod_user ON events.producer = prod_user.id
    ORDER BY events.date DESC, events.time DESC;
  `;

  pool.query(queryText)
    .then(result => {
      const cleanedEvents = result.rows.map(event => ({
        id: event.event_id,
        title: event.title,
        activity: event.activity,
        date: event.date,
        time: event.time,
        location: event.location,
        school_name: event.school_name,
        channel: event.channel,
        notes: event.notes,
        play_by_play: event.play_by_play,
        color_commentator: event.color_commentator,
        camera: event.camera,
        producer: event.producer,
        play_by_play_attended: event.play_by_play_attended,  // added
        color_commentator_attended: event.color_commentator_attended,  // added
        camera_attended: event.camera_attended,  // added
        producer_attended: event.producer_attended,  // added
        play_by_play_username: event.play_by_play_username,
        color_commentator_username: event.color_commentator_username,
        camera_username: event.camera_username,
        producer_username: event.producer_username
      }));
      
      res.status(200).json(cleanedEvents);
    })
    .catch(err => {
      console.error('[GET /clean Error]', err);
      res.status(500).json({ error: 'Database error' });
    });
});


//POST to create a new event
router.post('/',(req, res)=>{
  const userId = req.user.id;
  const {activities_id, date, time, title, school_id, location, channel, notes} = req.body;
  const queryText = `
INSERT INTO "events" ("created_by_id", "activities_id", "date", "time", "title","school_id","location", "channel", "notes")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
`;
  pool.query(queryText,[userId, activities_id, date, time, title, school_id, location, channel, notes])
  .then((results)=>{
    console.log("post to db", results)
    res.send(results)
  })
  .catch((err)=>{
    console.log("error in events.router post", err)
    res.sendStatus(400);
  })
})

//PUT route to handle updating an event
router.put('/', rejectUnauthenticated,(req, res)=>{
  const eventUpdate = req.body;
  const queryText = `
  UPDATE "events"
  SET activities_id = ($1),
  title = ($2),
  date = ($3),
  time = ($4),
  school_id = ($5),
  location = ($6),
  notes = ($7)
  WHERE id = $8;`;
  pool.query( queryText,[ 
    eventUpdate.activities_id, 
    eventUpdate.title, 
    eventUpdate.date, 
    eventUpdate.time, 
    eventUpdate.school_id, 
    eventUpdate.location,
    eventUpdate.notes,
  eventUpdate.id])
  .then((results)=>{
    console.log("put in events.router", results)
    res.sendStatus(200);
  })
  .catch(( err )=>{
    console.log("error in PUT in events.router", err);
    res.sendStatus(400)
  })
})

//DELETE for deleting an event
router.delete("/:id", ( req, res )=>{
  const eventId = req.params.id;
  const queryText = `DELETE FROM "events"
                     WHERE events.id = ($1);`;

  pool.query( queryText, [eventId])
  .then(( results )=>{
      res.sendStatus( 201  );
  }).catch(( err )=>{
      console.log( err );
      res.sendStatus( 400 );
  })
})

// Add this new route to update a user's event role
router.put('/update-role', async (req, res) => {
  try {
    const { eventId, userId, role } = req.body;
    
    // Validate required parameters
    if (!eventId || !userId || !role) {
      return res.status(400).send({ error: 'Missing required parameters' });
    }
    
    // Determine which column to update based on the role
    let roleColumn;
    switch (role) {
      case 'Play-by-Play':
        roleColumn = 'play_by_play';
        break;
      case 'Color Commentator':
        roleColumn = 'color_commentator';
        break;
      case 'Camera':
        roleColumn = 'camera';
        break;
      case 'Producer':
        roleColumn = 'producer';
        break;
      default:
        return res.status(400).send({ error: 'Invalid role' });
    }
    
    // Update the event with the new user ID for the specified role
    const query = `
      UPDATE events
      SET ${roleColumn} = $1
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [userId, eventId]);
    
    if (result.rows.length === 0) {
      return res.status(404).send({ error: 'Event not found' });
    }
    
    res.send(result.rows[0]);
  } catch (err) {
    console.error('Error updating event role:', err);
    res.status(500).send({ error: 'Server error', details: err.message });
  }
});

// Add this new route to delete a user's event role
router.put('/delete-role', async (req, res) => {
  try {
    const { eventId, role } = req.body;
    
    // Validate required parameters
    if (!eventId || !role) {
      return res.status(400).send({ error: 'Missing required parameters' });
    }
    
    // Determine which column to update based on the role
    let roleColumn;
    switch (role) {
      case 'Play-by-Play':
        roleColumn = 'play_by_play';
        break;
      case 'Color Commentator':
        roleColumn = 'color_commentator';
        break;
      case 'Camera':
        roleColumn = 'camera';
        break;
      case 'Producer':
        roleColumn = 'producer';
        break;
      default:
        return res.status(400).send({ error: 'Invalid role' });
    }
    
    // Set the role column to NULL to remove the user from the role
    const query = `
      UPDATE events
      SET ${roleColumn} = NULL
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [eventId]);
    
    if (result.rows.length === 0) {
      return res.status(404).send({ error: 'Event not found' });
    }
    
    res.send(result.rows[0]);
  } catch (err) {
    console.error('Error deleting event role:', err);
    res.status(500).send({ error: 'Server error', details: err.message });
  }
});

module.exports = router;