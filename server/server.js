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
import { randomBytes } from 'crypto';

// Get the directory name of the current module's file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to set up CORS based on environment
const setupCORS = () => {
  // Define allowed origins based on environment
  let allowedOrigins;
  if (process.env.TARGET_ENV === 'development') {
    allowedOrigins = ['http://localhost:8080'];
  } else if (process.env.TARGET_ENV === 'staging') {
    allowedOrigins = [process.env.STAGING_URL];
  } else if (process.env.TARGET_ENV === 'production') {
    allowedOrigins = [process.env.PROD_URL, process.env.PROD_ALT_URL];
  }

  // Handle CORS for all routes
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );
};

// Invoke the CORS setup function
setupCORS();

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

const setupSecurityHeaders = () => {
  // CSP middleware based on environment
  if (process.env.TARGET_ENV === 'development') {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'http://localhost:8080'],
          connectSrc: ["'self'", 'http://localhost:4000'],
        },
      }),
    );
    console.log('setupSecurityHeaders in development');
  } else if (process.env.TARGET_ENV === 'staging') {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", process.env.STAGING_URL],
          connectSrc: ["'self'", process.env.STAGING_URL],
          formAction: ["'self'", process.env.REACT_APP_FORM_ENDPOINT],
        },
      }),
    );
    console.log('setupSecurityHeaders in staging');
  } else if (process.env.TARGET_ENV === 'production') {
    // Generate Nonce to allow Google Analytics Tag
    const nonce = randomBytes(16).toString('base64');
    // Apply more restrictive CSP for production
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", process.env.PROD_URL, process.env.PROD_ALT_URL, 'https://www.googletagmanager.com', `'nonce-${nonce}'`],
          connectSrc: ["'self'", process.env.PROD_URL, process.env.PROD_ALT_URL, 'https://www.googletagmanager.com'],
          formAction: ["'self'", process.env.REACT_APP_FORM_ENDPOINT],
          imgSrc: ['www.googletagmanager.com'],
        },
      }),
    );
    // Set the nonce value in a variable accessible to the template engine
    app.locals.nonce = nonce;
    console.log('setupSecurityHeaders in production');
  }
};

// Invoke the security headers function
setupSecurityHeaders();

// Log route requests for debugging purposes
app.use((req, _, next) => {
  console.log(req.path, req.method);
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

// Serve static files
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, '../public')));

// Handle all other routes by sending the 'index.html' file
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

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
console.log('TARGET_ENV:', process.env.TARGET_ENV);
console.log('NODE_ENV:', process.env.NODE_ENV);

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
