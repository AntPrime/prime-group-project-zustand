const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

router.put('/:eventid', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const validRoles = ['play_by_play', 'color_commentator', 'camera', 'producer'];

  // Validate role input
  if (!validRoles.includes(role)) {
    res.sendStatus(400);
    return;
  }
  const column = `${role}_attended`;
  const queryText = `UPDATE events SET ${column} = NOT ${column} WHERE id = $1`;
  const values = [id];

  pool.query(queryText, values)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});
module.exports = router;