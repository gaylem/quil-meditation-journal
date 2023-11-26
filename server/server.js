// Load environment variables from a .env file
require('dotenv').config();

// Import required modules
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Log route requests for debugging purposes
app.use((req, _, next) => {
  console.log(req.path, req.method);
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const entryRouter = require('./routers/entryRouter');
const userRouter = require('./routers/userRouter');

// Define routes for entries and users
app.use('/api/entries', entryRouter);
app.use('/api/users', userRouter);

// Catch-all route handler for unknown routes
app.use((_, res) => res.status(404).send("This is not the page you're looking for..."));

// Express error handler
app.use((err, _, res) => {
  // Define a default error object
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  // Merge the default error object with the provided error, if any
  const errorObj = Object.assign({}, defaultErr, err);

  // Log the error
  console.log(errorObj.log);

  // Send a JSON response with the error status and message
  return res.status(errorObj.status).json(errorObj.message);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Statically serve everything in the build folder on the route '/build'
  app.use('/build', express.static(path.join(__dirname, '../build')));
}

// Log the current environment
console.log('NODE_ENV: ', process.env.NODE_ENV);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

// Export the Express app for external use (e.g., in tests)
module.exports = app;
