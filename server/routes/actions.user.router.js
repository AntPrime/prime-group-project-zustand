const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
// LMR PLEASE NOTE: this router file is for various actions that may be made to a user account 
// we kept it separate from the user.router to ensure we did not accidentally corrupt the 'base code' 
// provided with our project.
// as of mar 29-2025 this file has the following DB calls
// fetch all admin users
// fetch all super admin users
// fetch all users who are not admin or super admin

//This get route is for all users - which includes Admin, SuperAdmin, and users (think:students)

router.get('/', (req, res)=>{
    
   const queryText = `SELECT * FROM "user";`;
    pool.query(queryText)

    .then((results)=>{
     console.log("results from db", results.rows)
      res.send(results.rows)
    res.sendStatus (200);
    })
    .catch((err)=>{
      console.log("error in events.router get", err)
      res.sendStatus(400);
    })
   })

 //this get route will be for all admin users - but NOT super admin, nor users (think: users=students)
   
module.exports = router;
