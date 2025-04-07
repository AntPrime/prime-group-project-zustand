const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();
// LMR PLEASE NOTE: This route came with our standard build, and also uses auth in an effort
// to not accidentally mis-manage the user login/auth we have left this router alone
// functions like getting a list of users or changing a users access (admin & super admin)
// are handled in a separate router

// If the request came from an authenticated user, this route
// sends back an object containing that user's information.
// Otherwise, it sends back an empty object to indicate there
// is not an active session.
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send({});
  }
});

// Handles the logic for creating a new user. The one extra wrinkle here is
// that we hash the password before inserting it into the database.
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const hashedPassword = encryptLib.encryptPassword(req.body.password);

//?just added admin_level to set a new user's admin level to zero upon registering.
  const sqlText = `
    INSERT INTO "user"
      ("username", "password", "admin_level")
      VALUES
      ($1, $2, 0);
  `;
  const sqlValues = [username, hashedPassword];

  pool.query(sqlText, sqlValues)
    .then(() => {
      res.sendStatus(201)
    })
    .catch((dbErr) => {
      console.log('POST /api/user/register error: ', dbErr);
      res.sendStatus(500);
    });
});

// Handles the logic for logging in a user. When this route receives
// a request, it runs a middleware function that leverages the Passport
// library to instantiate a session if the request body's username and
// password are correct.
  // You can find this middleware function in /server/strategies/user.strategy.js.
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// Clear all server session information about this user:
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user.
  req.logout((err) => {
    if (err) { 
      return next(err); 
    }
    res.sendStatus(200);
  });
});

// Add this new route to get all users
router.get('/all', async (req, res) => {
  try {
    // Query to get all users
    const query = `
      SELECT id, username, school_id, admin, super_admin, active
      FROM "user"
      ORDER BY username
    `;
    
    const result = await pool.query(query);
    res.send(result.rows);
  } catch (err) {
    console.error('Error fetching all users:', err);
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
