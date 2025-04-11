const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();


router.put('/assignRole', async (req, res) => {
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
// PUT route to reassign user between events/roles
router.put('/reassign-role', async (req, res) => {
  try {
    const { originalEventId, originalRole, newEventId, newRole, userId } = req.body;
    
    // Validate required parameters
    if (!originalEventId || !originalRole || !newEventId || !newRole || !userId) {
      return res.status(400).send({ error: 'Missing required parameters' });
    }

    // Start transaction
    await pool.query('BEGIN');

    // Remove from old role/event
    const deleteQuery = `
      UPDATE events
      SET ${getRoleColumn(originalRole)} = NULL
      WHERE id = $1
    `;
    await pool.query(deleteQuery, [originalEventId]);

    // Add to new role/event
    const insertQuery = `
      UPDATE events
      SET ${getRoleColumn(newRole)} = $1
      WHERE id = $2
    `;
    await pool.query(insertQuery, [userId, newEventId]);

    // Commit transaction
    await pool.query('COMMIT');
    
    res.send({ message: 'Role reassigned successfully' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error reassigning role:', err);
    res.status(500).send({ error: 'Server error' });
  }
});

// Helper function to map role names to DB columns
const getRoleColumn = (role) => {
  switch(role) {
    case 'Play-by-Play': return 'play_by_play';
    case 'Color Commentator': return 'color_commentator';
    case 'Camera': return 'camera';
    case 'Producer': return 'producer';
    default: throw new Error('Invalid role');
  }
};
module.exports = router;