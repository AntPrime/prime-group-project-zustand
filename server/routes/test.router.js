const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

router.get('/', (req, res)=>{
  const queryText = `SELECT * FROM "test"`
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
