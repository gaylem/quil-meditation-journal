//** RATE LIMITER UTILITY FUNCTIONS */

import rateLimit from 'express-rate-limit';

//** LOGIN & SIGNUP RATE LIMITERS */

export const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow 5 requests per windowMs
  handler: (req, res) => {
    const response = {
      status: 429, // HTTP status code for "Too Many Requests"
      message: 'Too many requests, please try again later.',
    };
    res.status(response.status).json(response);
  },
});
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow 5 requests per windowMs
  handler: (req, res) => {
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`Rate limit exceeded for IP address: ${clientIP}`);

    const response = {
      status: 429, // HTTP status code for "Too Many Requests"
      message: 'Too many requests, please try again later.',
    };

    res.status(response.status).json(response);
  },
});

//** ACCOUNT RATE LIMITERS */

export const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow 5 requests per windowMs
  handler: (req, res) => {
    const response = {
      status: 429, // HTTP status code for "Too Many Requests"
      message: 'Too many requests, please try again later.',
    };
    res.status(response.status).json(response);
  },
});

export const usernameLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow 5 requests per windowMs
  handler: (req, res) => {
    const response = {
      status: 429, // HTTP status code for "Too Many Requests"
      message: 'Too many requests, please try again later.',
    };
    res.status(response.status).json(response);
  },
});

export const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow 5 requests per windowMs
  handler: (req, res) => {
    const response = {
      status: 429, // HTTP status code for "Too Many Requests"
      message: 'Too many requests, please try again later.',
    };
    res.status(response.status).json(response);
  },
});

export const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow 5 requests per windowMs
  handler: (req, res) => {
    const response = {
      status: 429, // HTTP status code for "Too Many Requests"
      message: 'Too many requests, please try again later.',
    };
    res.status(response.status).json(response);
  },
});
