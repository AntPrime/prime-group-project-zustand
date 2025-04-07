const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

router.get('/', (req, res)=>{
  const userId = req.user.id;
  const queryText = `
SELECT u.username, 
e.title, 
e.date, 
e.time, 
e.school_id, 
e.location,
schools.name AS "school name" 
FROM "user" AS u
JOIN "events" AS e 
ON u.id IN (e.play_by_play, e.camera, e.producer, e.color_commentator)
JOIN "schools" ON schools.id = e.school_id 
WHERE u.id =$1;
`;
pool.query(queryText, [userId])
.then((results)=>{
  console.log("results from student.router get", results.rows)
  res.sendStatus(201)
})
.catch((err)=>{
  console.log("err in student.router get", err)
  res.sendStatus(400);
});
});

module.exports = router;