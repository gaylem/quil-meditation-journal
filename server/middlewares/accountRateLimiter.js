// Middleware for rate limiting based on a single user with a 15-minute window
export const accountRateLimiter = (req, res, next) => {
  const currentTime = Date.now();
  const windowDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
  const requestLimit = 8;

  // Initialize user request count and reset timestamp if not already present
  if (!userRequestCount) {
    userRequestCount = [];
  }

  // Remove requests that fall outside the 15-minute window
  userRequestCount = userRequestCount.filter(timestamp => timestamp > currentTime - windowDuration);
  console.log('userRequestCount: ', userRequestCount);

  // Check if the user has exceeded the request limit
  if (userRequestCount.length >= requestLimit) {
    // Check if it's time to reset the count
    if (!resetTimer) {
      resetTimer = setTimeout(() => {
        userRequestCount = [];
        console.log('userRequestCount: ', userRequestCount);
        resetTimer = null;
        console.log('resetTimer: ', resetTimer);
      }, windowDuration);
    }

    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }

  // Add the current request timestamp to the window
  userRequestCount.push(currentTime);
  console.log('userRequestCount: ', userRequestCount);

  next();
};

// In-memory storage for request timestamps and reset timer
let userRequestCount = [];
let resetTimer = null;
console.log('userRequestCount: ', userRequestCount);
