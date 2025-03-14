const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

router.get('/', (req, res)=>{
  const queryText = `SELECT events.id AS "events id", 
activities.activity AS "activity", 
events.location AS "location",  
events.home_team AS "home team", 
events.away_team AS "away team", 
pbp_user.username AS "play-by-play",
color_comm_user.username AS "color comm.",
camera.username AS "camera",
producer.username AS "producer",
events.channel AS "channel", 
events.notes AS "notes"
FROM events
LEFT JOIN activities ON events.activities_id = activities.id
LEFT JOIN users AS "pbp_user" ON pbp_user.id = events.play_by_play
LEFT JOIN users AS "color_comm_user" ON color_comm_user.id = events.color_commentator
LEFT JOIN users AS "camera" ON camera.id = events.camera
LEFT JOIN users AS "producer" ON producer.id = events.producer
ORDER BY events.id; `
  pool.query(queryText)
  .then((results)=>{
    console.log("results from db", results.rows)
    res.send(results.rows)
  })
  .catch((err)=>{
    console.log("error in test.router get", err)
    res.sendStatus(400);
  })
})

module.exports = router;
