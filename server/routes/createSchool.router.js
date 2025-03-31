const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

//POST to add new school
router.post('/',(req, res)=>{
  const {name, address} = req.body;
  const queryText = `
INSERT INTO "schools" ("name", "address")
VALUES ($1, $2);
`;
  pool.query(queryText,[name, address])
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