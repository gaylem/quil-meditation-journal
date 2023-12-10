//** SERVER */

// Load environment variables from a .env file
import dotenv from 'dotenv';
dotenv.config();

// Import Express
import express from 'express';
const app = express();

// Import required modules
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import etag from 'etag';

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
app.use(express.json()); // Parses the JSON data and makes it available in the req.body object.
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(cookieParser()); // Parses incoming cookie headers, extracts the cookies, and makes them available in the req.cookies object.
app.use(helmet()); // Applies HTTP headers such as X-Content-Type-Options, Strict-Transport-Security, X-Frame-Options, X-XSS-Protection, and others for enhanced security

// Log route requests for debugging purposes
app.use((req, _, next) => {
  console.log(req.path, req.method);
  next();
});

// Serve static files from the 'public' directory
const publicPath = path.resolve(__dirname, 'public');

// Set Cache Control Header and ETag Header
app.use(
  '/images',
  (req, res, next) => {
    console.log('Custom middleware for images');

    const originalSend = res.send;
    res.send = function (body) {
      const tag = etag(body);
      console.log('ETag:', tag);
      res.setHeader('ETag', tag);
      originalSend.call(this, body);
    };
    next();
  },
  express.static(path.join(publicPath, 'images')),
);

// Import Routes
import entryRouter from './routers/entryRouter.js';
import userRouter from './routers/userRouter.js';
import accountRouter from './routers/accountRouter.js';

// Define routes for entries and users
app.use('/api/entries', entryRouter);
app.use('/api/users', userRouter);
app.use('/api/accounts', accountRouter);

// Handle requests to any route by serving the appropriate 'index.html' file
app.get('/*', function (req, res) {
  res.sendFile(path.join(publicPath, 'index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// Catch-all route handler for unknown routes
app.use((_, res) => res.status(404).send("A journey of a thousand miles begins with a single step...but not in this direction."));

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
// TODO: Will I need this in CI/CD? Or is it just not doing anything?
if (process.env.NODE_ENV === 'production') {
  // Statically serve everything in the build folder on the route '/build'
  app.use('/public', express.static(path.join(__dirname, '../public')));
}

// Log the current environment
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

// Export the app
export default app;
