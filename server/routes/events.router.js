const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

router.get('/', (req, res)=>{
  const queryText = ` 
SELECT events.id AS "events id", 
events.title AS "title",
categories.activity AS "activity", 
events.date AS "date",
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
ORDER BY events.id; `;
  pool.query(queryText)
  .then((results)=>{
    console.log("results from db", results.rows)
    res.send(results.rows)
  })
  .catch((err)=>{
    console.log("error in events.router get", err)
    res.sendStatus(400);
  })
})

router.post('/', (req, res)=>{
  const queryText = `
INSERT INTO "events" ("activities_id","title", "date","time","school_id","location","play_by_play","color_commentator","camera","producer","channel","notes")
VALUES )
($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);
`;
  pool.query(queryText)
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
