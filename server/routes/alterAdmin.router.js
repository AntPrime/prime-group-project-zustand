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

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.admin_level >= 2) { // Assuming 2 is super admin
    next();
  } else {
    res.sendStatus(403);
  }
};
router.put('/:username', checkAdmin, (req, res) => {
  const username = req.params.username;
  const { admin_level } = req.body;

  // Convert 'null' string to actual null if needed
  const sanitizedLevel = admin_level === 'null' ? null : admin_level;

  const queryText = `
    UPDATE "user" 
    SET admin_level = $1 
    WHERE username = $2
    RETURNING username, admin_level;
  `;

  pool.query(queryText, [sanitizedLevel, username])
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).send('User not found');
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch((err) => {
      console.log('Error updating admin level:', err);
      res.sendStatus(500);
    });
});
module.exports = router;