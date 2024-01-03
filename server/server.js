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
const allowedOrigins = ['http://localhost:8080', 'http://localhost:8081', 'https://quil-prod-b3e044c49835.herokuapp.com/', 'https://quil.space'];

// Handle CORS
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

// Add this middleware to set the 'Access-Control-Allow-Origin' header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://classy-chimera-e7b4ec.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).send();
  } else {
    next();
  }
});

// Middleware setup
app.use(express.json()); // Parses the JSON data and makes it available in the req.body object.
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(cookieParser()); // Parses incoming cookie headers, extracts the cookies, and makes them available in the req.cookies object.

// Security Middleware
app.use(helmet()); // Applies HTTP headers such as X-Content-Type-Options, Strict-Transport-Security, X-Frame-Options, X-XSS-Protection, and others for enhanced security

// Frameguard Middleware
app.use(helmet.frameguard({ action: 'deny' }));

// HSTS Middleware (example, adjust as needed)
app.use(
  helmet.hsts({
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  }),
);

// Referrer Policy Middleware
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

// Function to set up security headers based on environment
const setupSecurityHeaders = () => {
  // CSP middleware based on environment
  if (process.env.NODE_ENV === 'development') {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-eval'", 'http://localhost:8080'],
          connectSrc: ["'self'", 'http://localhost:4000'],
        },
      }),
    );
    console.log('setupSecurityHeaders in development');
  } else {
    // Apply more restrictive CSP for production
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://quil-staging-97e232bad7d0.herokuapp.com/', 'https://quil-prod-b3e044c49835.herokuapp.com/'],
          // Add other directives as needed for production
        },
      }),
    );
  }
};

// Invoke the security headers function
setupSecurityHeaders();

// Log route requests for debugging purposes
app.use((req, _, next) => {
  console.log(req.path, req.method);
  next();
});

// Serve static files from build folder in production or staging
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(express.static(path.join(__dirname, '../public/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public', 'build', 'index.html'));
  });
  // If env is development (local), serve the static files from the public folder
} else if (process.env.NODE_ENV === 'development') {
  console.log('Serving static files from development/public');
  app.use(express.static('public'));
} else if (err) {
  res.status(500).send(err);
}
// Set Cache Control Header and ETag Header
app.use((req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    // Check if the body is a string or a Buffer before calculating ETag
    if (typeof body === 'string' || Buffer.isBuffer(body)) {
      const tag = etag(body);
      res.setHeader('ETag', tag);
    }

    originalSend.call(this, body);
  };

  next();
});

// Import Routes
import entryRouter from './routers/entryRouter.js';
import userRouter from './routers/userRouter.js';
import accountRouter from './routers/accountRouter.js';

// Define routes for entries and users
app.use('/api/entries', entryRouter);
app.use('/api/users', userRouter);
app.use('/api/accounts', accountRouter);

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

// Log the current environment
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Start the server
let port = process.env.PORT;
if (port == null || port == '') {
  port = 8000;
}
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Export the app
export default app;
