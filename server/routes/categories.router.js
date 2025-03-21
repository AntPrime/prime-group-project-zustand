const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET all categories
router.get('/', (req, res) => {
  const queryText = 'SELECT * FROM "categories" ORDER BY "activity"';
  pool.query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('Error getting categories', err);
      res.sendStatus(500);
    });
});

module.exports = router; 