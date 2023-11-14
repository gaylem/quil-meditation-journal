require('dotenv').config();

const cookieParser = require('cookie-parser');
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Cookies
const cookieController = require('./controllers/cookieController');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const entryRouter = require('./routers/entryRouter');
const userRouter = require('./routers/userRouter');

// Routers
app.use('/api/entries', entryRouter);
app.use('/api/users', userRouter);

// Catch-all route handler for any requests to an unknown route
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send("This is not the page you're looking for..."));

// Express error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Environments
if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/build', express.static(path.join(__dirname, '../build')));
}
console.log('NODE_ENV: ', process.env.NODE_ENV);

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

module.exports = app;
