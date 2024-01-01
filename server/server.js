//** SERVER */

// Import Express
import express from 'express';
const app = express();

// Import required modules
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name of the current module's file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(express.json()); // Parses the JSON data and makes it available in the req.body object.
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Log route requests for debugging purposes
app.use((req, _, next) => {
  console.log(req.path, req.method);
  next();
});

// Serve static files from the 'public' directory
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Handle requests to any route by serving the appropriate 'index.html' file
app.get('/*', function (req, res) {
  res.sendFile(path.join(publicPath, 'index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// Catch-all route handler for unknown routes
app.use((_, res) => res.status(404).send('A journey of a thousand miles begins with a single step...but not in this direction.'));

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
  console.error(errorObj.log);
  // Send a JSON response with the error status and message
  return res.status(errorObj.status).json(errorObj.message);
});

if (process.env.NODE_ENV === 'production') {
  // Statically serve everything in the build folder on the route '/build'
  app.use('/public/build', express.static(path.join(__dirname, '../public/build')));
}

// Log the current environment
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

// Export the app
export default app;
