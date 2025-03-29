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

  router.get('/admin', async (req, res) => {
    const queryText = `
      SELECT 
        events.id,
        events.title,
        events.date,
        events.time,
        events.location,
        events.channel,
        events.notes,
        schools.name AS school_name,
        pbp_user.username AS play_by_play,
        cc_user.username AS color_commentator,
        cam_user.username AS camera,
        prod_user.username AS producer,
        COALESCE(
          json_object_agg(
            ep.user_id, 
            json_build_object(
              'paid', ep.paid,
              'payment_date', ep.payment_date
            )
          ) FILTER (WHERE ep.user_id IS NOT NULL),
          '{}'
        ) AS payments
      FROM events
      LEFT JOIN schools ON events.school_id = schools.id
      LEFT JOIN "user" pbp_user ON events.play_by_play = pbp_user.id
      LEFT JOIN "user" cc_user ON events.color_commentator = cc_user.id
      LEFT JOIN "user" cam_user ON events.camera = cam_user.id
      LEFT JOIN "user" prod_user ON events.producer = prod_user.id
      LEFT JOIN (
        SELECT DISTINCT ON (event_id, user_id) *
        FROM event_payments
        ORDER BY event_id, user_id, payment_date DESC
      ) ep ON events.id = ep.event_id
      GROUP BY events.id, schools.name, 
        pbp_user.username, cc_user.username, 
        cam_user.username, prod_user.username
      ORDER BY events.date DESC, events.time DESC;
    `;
  
    try {
      const result = await pool.query(queryText);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('[GET /admin Error]', err);
      res.status(500).json({ error: 'Database error' });
    }
  });
module.exports = router;