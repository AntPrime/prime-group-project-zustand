require('dotenv').config();
const express = require('express');

// Instantiate an express server:
const app = express();

// Use process.env.PORT if it exists, otherwise use 5001:
const PORT = process.env.PORT || 5001;

// Require auth-related middleware:
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Require router files:
const userRouter = require('./routes/user.router');
const eventsRouter = require('./routes/events.router');
const assignRoleRouter = require('./routes/assignRole.router');
const paymentRouter = require('./routes/payment.router');
const createSchoolRouter = require('./routes/createSchool.router');
const createActivityRouter = require('./routes/createActivity.router');

// Apply middleware:
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Apply router files:
app.use('/api/user', userRouter);
app.use('/api/events', eventsRouter);
app.use('/api/assignRole', assignRoleRouter);
app.use('/api/events/payments', paymentRouter);
app.use('/api/createSchool', createSchoolRouter);
app.use('/api/createActivity', createActivityRouter);


// Start the server:
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
