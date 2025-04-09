const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();




//GET list activities
router.get('/activities', (req, res) => {
 const queryText = `SELECT * FROM "categories";`;
 pool.query(queryText).then((results) => {
   console.log('Schools from database:', results.rows);  // Check the data being returned
   res.send(results.rows);
 }).catch((err)=>{
   console.log("error in GET create Activity", err)
   res.sendStatus(400);
 });
});


//POST to add new activity
router.post('/activities',(req, res)=>{
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
 });
});


// DELETE a school
router.delete('/activities/:id', (req, res) => {
 const categoriesId = req.params.id;
 const queryText = 'DELETE FROM "categories" WHERE "id" = $1;';


 pool.query(queryText, [categoriesId]).then((results) => {
     console.log('activities deleted:', results);
     res.sendStatus(201);  // Return success status
   })
   .catch((err) => {
     console.log('Error deleting activities:', err);
     res.sendStatus(400);  // Return error status
   });
});




module.exports = router;
