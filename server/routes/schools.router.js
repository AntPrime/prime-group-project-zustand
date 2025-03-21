const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET all schools
router.get('/', (req, res) => {
  const queryText = 'SELECT * FROM "schools" ORDER BY "name"';
  pool.query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('Error getting schools', err);
      res.sendStatus(500);
    });
});

module.exports = router; 