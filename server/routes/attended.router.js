const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();
router.put('/:eventId', (req, res) => {
  const { eventId } = req.params;
  const { role } = req.body;
  const validRoles = ['play_by_play', 'color_commentator', 'camera', 'producer'];

  if (!validRoles.includes(role)) {
    return res.sendStatus(400);
  }

  const column = `${role}_attended`;
  const queryText = `UPDATE events SET ${column} = NOT ${column} WHERE id = $1 RETURNING *`;
  const values = [eventId];

  console.log('Executing query:', queryText, 'with values:', values);

  pool.query(queryText, values)
    .then(result => {
      console.log('Update result:', result.rows[0]);
      res.sendStatus(200);
    })
    .catch(err => {
      console.error('Database error:', err);
      res.sendStatus(500);
    });
});
// GET all events that the logged-in user is signed up for
router.get('/registered/:userId', async (req, res) => {
  const userId = req.params.userId;
  
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
      -- Check which roles the user has
      CASE 
        WHEN events.play_by_play = $1 THEN 'Play-by-Play'
        WHEN events.color_commentator = $1 THEN 'Color Commentator'
        WHEN events.camera = $1 THEN 'Camera'
        WHEN events.producer = $1 THEN 'Producer'
      END AS user_role
    FROM events
    LEFT JOIN categories ON events.activities_id = categories.id
    LEFT JOIN schools ON events.school_id = schools.id
    WHERE 
      events.play_by_play = $1 OR
      events.color_commentator = $1 OR
      events.camera = $1 OR
      events.producer = $1
    ORDER BY events.date DESC, events.time DESC;
  `;

  pool.query(queryText, [userId])
    .then(result => {
      const userEvents = result.rows.map(event => ({
        id: event.event_id,
        title: event.title,
        activity: event.activity,
        date: event.date,
        time: event.time,
        location: event.location,
        school_name: event.school_name,
        channel: event.channel,
        notes: event.notes,
        role: event.user_role
      }));
      
      res.status(200).json(userEvents);
    })
    .catch(err => {
      console.error('[GET /user-events Error]', err);
      res.status(500).json({ error: 'Database error' });
    });
});
module.exports = router;