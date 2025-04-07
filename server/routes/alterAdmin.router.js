const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

router.get('/', (req, res)=>{
  const queryText = `
SELECT 
username,
admin_level
FROM "user";
`;
pool.query(queryText)
.then((results)=>{
  console.log("results from alterAdmin.router get", results.rows)
  res.json(results.rows)
})
.catch((err)=>{
  console.log("err in alterAdmin.router get", err)
  res.sendStatus(400);
});
});

module.exports = router;