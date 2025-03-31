const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

//POST to add new activity
router.post('/',(req, res)=>{
  const {activity} = req.body;
  const queryText = `
INSERT INTO "categories" ("activity")
VALUES ($1);
`;
  pool.query(queryText,[activity])
  .then((results)=>{
    console.log("post to db", results)
    res.send(results)
  })
  .catch((err)=>{
    console.log("error in createActivity.router post", err)
    res.sendStatus(400);
  })
})
module.exports = router;