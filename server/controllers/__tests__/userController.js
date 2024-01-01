//** USER CONTROLLER TESTS */

// Import necessary modules and dependencies
// Importing using ES6 import syntax
import userController from '../userController';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { createTokens } from '../tokenUtils';
import User from '../models/User';

// Mock the necessary modules and dependencies
jest.mock('bcrypt');
jest.mock('validator');
jest.mock('../models/User');
jest.mock('../tokenUtils');

describe('userController.signupUser', () => {
  // Helper function to create a mock request
  const createMockRequest = body => ({ body });

  // Helper function to create a mock response
  const createMockResponse = () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    };
    res.status.mockClear();
    res.json.mockClear();
    return res;
  };

  beforeEach(() => {
    // Clear mock implementations before each test
    jest.clearAllMocks();
  });

  test('should handle valid signup', async () => {
    // Mock request and response
    const req = createMockRequest({
      username: 'testuser',
      email: 'test@example.com',
      password: 'ABCabc123!',
    });
    const res = createMockResponse();

    // Mocking the User.findOne method to return null (indicating email and username are not already in use)
    User.findOne.mockResolvedValue(null);

    // Mocking the bcrypt.genSalt and bcrypt.hash methods
    bcrypt.genSalt.mockResolvedValue('mocked-salt');
    bcrypt.hash.mockResolvedValue('mocked-hash');

    // Mocking the User.save method to return a user object
    User.prototype.save.mockResolvedValue({
      _id: 'mocked-user-id',
      username: 'testuser',
      email: 'test@example.com',
    });

    // Mocking the createTokens method to return a token
    createTokens.mockReturnValue('mocked-token');

    // Call the signupUser function
    await userController.signupUser(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      username: 'testuser',
      userId: 'mocked-user-id',
      token: 'mocked-token',
    });
  });

  // Add more test cases for invalid signups and error handling
});
