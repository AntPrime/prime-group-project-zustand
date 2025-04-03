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
module.exports = router;