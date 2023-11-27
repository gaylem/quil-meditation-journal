const express = require('express');
const router = express.Router();

// Entry controllers
const { getAllEntries, addEntry, findEntry, updateEntry, deleteEntry } = require('../controllers/entryController');

// Verify access token controller
const { verifyAccessToken } = require('../utils/token.utils');

/**
 * @route GET /entries
 * @description Get all entries
 * @access Private (requires access token)
 */
 // TODO: Update get requests to send userId in req.params
router.get('/', verifyAccessToken, getAllEntries);

/**
 * @route GET /entries/:id
 * @description Get a specific entry by ID
 * @param req.params
 *  - entry ID: String
 * @access // TODO: make Private (requires access token)
 */
// TODO: Add verifyAccessToken
router.get('/:id', findEntry);

/**
 * @route DELETE /entries/:id
 * @description Delete a specific entry by ID
 * @param req.params
 *  - entry ID: String
 * @access // TODO: make Private (requires access token)
 */
// TODO: Add verifyAccessToken
router.delete('/:id', deleteEntry);

/**
 * @route POST /entries
 * @description Create a new entry
 * @access // TODO: make Private (requires access token)
 * @param {Object} req - The requst object containing:
 *  - body: String
 *  - userId: String
 */
// TODO: Add verifyAccessToken
router.post('/', addEntry);

/**
 * @route PATCH /entries/:id
 * @description Update a specific entry by ID
 * @param req.params
 *  - entry ID: String
 * @access // TODO: make Private (requires access token)
 */
// TODO: Add verifyAccessToken
router.patch('/:id', updateEntry);

module.exports = router;
