//** AXIOS CONFIG */

import axios from 'axios';

// Define base URLs for different environments
const baseURLs = {
  development: 'http://localhost:4000',
  staging: 'https://quil-staging-97e232bad7d0.herokuapp.com',
  production: 'https://quil-prod-b3e044c49835.herokuapp.com',
};

// Determine the environment based on NODE_ENV or default to 'development'
const environment = process.env.TARGET_ENV;

// Create an instance of Axios with a custom configuration
const instance = axios.create({
  // Set the base URL for requests
  baseURL: baseURLs[environment],
  withCredentials: true,
});

export default instance;
