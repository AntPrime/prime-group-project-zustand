const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

//GET list schools
router.get('/schools', (req, res) => {
  const queryText = `SELECT * FROM "schools";`;
  pool.query(queryText).then((results) => {
    console.log('Schools from database:', results.rows);  // Check the data being returned
    res.send(results.rows);
  }).catch((err)=>{
    console.log("error in GET createSchool", err)
    res.sendStatus(400);
  });
});

//POST to add new school
router.post('/schools',(req, res)=>{
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
    console.log("error in createSchool.router post", err)
    res.sendStatus(400);
  });
});

// DELETE a school
router.delete('/schools/:id', (req, res) => {
  const schoolId = req.params.id;  // Extract school ID from the URL
  const queryText = 'DELETE FROM "schools" WHERE "id" = $1;';

  pool.query(queryText, [schoolId]).then((results) => {
      console.log('School deleted:', results);
      res.sendStatus(201);  // Return success status
    })
    .catch((err) => {
      console.log('Error deleting school:', err);
      res.sendStatus(400);  // Return error status
    });
});


// //DELETE for deleting an event
// router.delete("/:id", ( req, res )=>{
//   const eventId = req.params.id;
//   const queryText = `DELETE FROM "events"
//                      WHERE events.id = ($1);`;

//   pool.query( queryText, [eventId])
//   .then(( results )=>{
//       res.sendStatus( 201  );
//   }).catch(( err )=>{
//       console.log( err );
//       res.sendStatus( 400 );
//   })
// })

module.exports = router;