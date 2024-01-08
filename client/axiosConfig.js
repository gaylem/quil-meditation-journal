//** AXIOS CONFIG */

import axios from 'axios';

let baseUrl;

// Set environment to development if TARGET_ENV is not production or staging
if (TARGET_ENV === 'production') {
  baseUrl = 'https://quil-prod-b3e044c49835.herokuapp.com';
} else if (TARGET_ENV === 'staging') {
  baseUrl = 'https://quil-staging-97e232bad7d0.herokuapp.com';
} else {
  baseUrl = 'http://localhost:4000';
}

// Create an instance of Axios with a custom configuration
const instance = axios.create({
  // Set the base URL for requests
  baseURL: baseURL,
  withCredentials: true,
});

export default instance;
