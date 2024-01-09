//** AXIOS CONFIG */

import axios from 'axios';

let baseURL;

// Set environment to development based on TARGET_ENV
if (TARGET_ENV === 'production') {
  baseURL = PROD_URL;
} else if (TARGET_ENV === 'staging') {
  baseURL = STAGING_URL;
} else {
  baseURL = 'http://localhost:4000';
}

// Create an instance of Axios with baseURL and withCredentials: true
const instance = axios.create({
  // Set the base URL for requests
  baseURL: baseURL,
  withCredentials: true,
});

export default instance;
