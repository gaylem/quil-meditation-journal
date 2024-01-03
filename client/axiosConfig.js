//** AXIOS CONFIG */

import axios from 'axios';

// Determine the base URL based on the environment
let baseURL;

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:4000';
  console.log('baseURL: ', baseURL);
} else if (process.env.NODE_ENV === 'staging') {
  baseURL = 'https://quil-staging-97e232bad7d0.herokuapp.com';
  console.log('baseURL: ', baseURL);
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://quil-prod-b3e044c49835.herokuapp.com';
  console.log('baseURL: ', baseURL);
}

// Create an instance of Axios with a custom configuration
const instance = axios.create({
  // Set the base URL for requests
  baseURL,
});

// Set withCredentials for the instance
instance.defaults.withCredentials = true;

export default instance;
