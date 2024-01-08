//** AXIOS CONFIG */

import axios from 'axios';

const baseURLs = {
  development: 'http://localhost:4000',
  staging: 'https://quil-staging-97e232bad7d0.herokuapp.com',
  production: 'https://quil-prod-b3e044c49835.herokuapp.com',
};

const environment = process.env.NODE_ENV;

const axiosInstance = axios.create({
  baseURL: baseURLs[environment],
});

axiosInstance.defaults.withCredentials = true;

// Add an interceptor to dynamically set the base URL before each request
axiosInstance.interceptors.request.use((config) => {
  // Set the base URL based on the environment
  config.baseURL = baseURLs[process.env.NODE_ENV];
  return config;
});

export default axiosInstance;
