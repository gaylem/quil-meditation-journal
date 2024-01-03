//** AXIOS CONFIG */

import axios from 'axios';

// Determine the base URL based on the environment
let baseURL;

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:4000';
} else if (process.env.NODE_ENV === 'staging') {
  baseURL = 'https://quil-staging-97e232bad7d0.herokuapp.com';
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://quil-prod-b3e044c49835.herokuapp.com';
} else {
  // Default to a development URL if the environment is not explicitly set
  baseURL = 'http://localhost:4000';
}

// Create an instance of Axios with a custom configuration
const instance = axios.create({
  // Set the base URL for requests
  baseURL,
});

// Set withCredentials for the instance
instance.defaults.withCredentials = true;

export default instance;
