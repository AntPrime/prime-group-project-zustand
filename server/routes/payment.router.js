const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

router.put('/payment', async (req, res) => {
    const { eventId, userId, role, paid } = req.body;
  
    try {
      // Record every payment status change
      const result = await pool.query(`
        INSERT INTO event_payments 
          (event_id, user_id, role, paid)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `, [eventId, userId, role, paid]);
  
      res.json({
        success: true,
        payment: result.rows[0]
      });
      
    } catch (err) {
      console.error('Payment record error:', err);
      res.status(500).json({ 
        error: 'Failed to record payment status',
        details: err.message
      });
    }
  });
module.exports = router;