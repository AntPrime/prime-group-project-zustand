const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

router.put('/assign-role', async (req, res) => {
    console.log('Request received at /assign');
    const { eventId, roleColumn, userId } = req.body; 
  
    // Validate that roleColumn is a valid column name to prevent SQL injection
    const validRoles = ["producer", "camera", "play_by_play", "color_commentator"];
    if (!validRoles.includes(roleColumn)) {
      return res.status(400).json({ error: "Invalid role" });
    }
  
    try {
      const query = `
        UPDATE events
        SET ${roleColumn} = $1
        WHERE id = $2
        RETURNING *;
      `;
  
      const result = await pool.query(query, [userId, eventId]);
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Detailed error:", {
          message: error.message,
          stack: error.stack,
          query: query,
          parameters: [userId, eventId]
        });
        res.status(500).send("Error updating event role");
      }
  });
module.exports = router;