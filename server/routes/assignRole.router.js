const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

router.put('/', async (req, res) => {
    console.log('Request received at /assign');
    const { eventId, roleColumn } = req.body; 
    const userId = req.user.id
    // Validate that roleColumn is a valid column name to prevent SQL injection
    const validRoles = ["producer", "camera", "play_by_play", "color_commentator"];
    if (!validRoles.includes(roleColumn)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    try {
      const query = `
        UPDATE "events"
        SET ${roleColumn} = $1
        WHERE events.id = $2;
      `;
  
      const result = await pool.query(query, [userId, eventId]);
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error updating event role");
      }
  });
module.exports = router;