//** SERVER */

// Load environment variables from a .env file
import dotenv from 'dotenv';
dotenv.config();

// Import required modules
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// Get the directory name of the current module's file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle CORS
const allowedOrigins = ['http://localhost:8080', 'http://localhost:8081', 'https://quil.space'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());
app.use(bodyParser.json());

// Log route requests for debugging purposes
app.use((req, _, next) => {
  console.log(req.path, req.method);
  next();
});

// Import Routes
// Import the routers using ES6 import syntax
import entryRouter from './routers/entryRouter.js';
import userRouter from './routers/userRouter.js';
import accountRouter from './routers/accountRouter.js';

// Define routes for entries and users
app.use('/api/entries', entryRouter);
app.use('/api/users', userRouter);
app.use('/api/accounts', accountRouter);

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
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

// Export the app
export default app;
