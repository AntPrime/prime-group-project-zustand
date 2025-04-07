const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
    console.log("we are up! reporting router!")
    console.log (req.query);
    const {start_date,end_date,school_id} = req.query 
    const queryText = `
        WITH "filtered_events" AS (
        SELECT * FROM "events" 
        WHERE "date" BETWEEN $1 AND $2 
        AND "school_id" = $3
        ) 
        SELECT "user"."id", "username", "title", "date", "time", "play_by_play", "color_commentator", "camera", "producer" 
        FROM "user"
        JOIN "filtered_events" AS "e" ON 
        "user"."id" = "e"."camera" OR 
        "user"."id" = "e"."play_by_play" OR 
        "user"."id" = "e"."color_commentator" OR 
        "user"."id" = "e"."producer"
        ORDER BY "user"."id"
        `;

    pool.query(queryText, [start_date, end_date, school_id])
  .then((results)=>{
    console.log("get from db", results.rows)
    res.send(results.rows)
  })
  .catch((err)=>{
    console.log("error in reporting.router post", err)
    res.sendStatus(400);
  })
  });

module.exports = router;
