const express = require('express');
const router = express.Router();

// Entry controllers
const { getAllEntries, addEntry, findEntry, updateEntry, deleteEntry } = require('../controllers/entryController');

/**
 * @route GET /entries
 * @description Get all entries for a specific user
 * @param req.params userId: String
 */
router.get('/:id', getAllEntries);

// TODO: findEntry might not be needed
/**
 * @route GET /entries/:id
 * @description Get a specific entry by ID
 * @param req.params entry ID: String
 */
router.get('/:id', findEntry);

/**
 * @route DELETE /entries/:id
 * @description Delete a specific entry by ID
 * @param req.params entry ID: String
 */
router.delete('/:id', deleteEntry);

/**
 * @route POST /entries
 * @description Create a new entry
 * @param {Object} req - The requst object containing:
 *  - body: String
 *  - userId: String
 */
router.post('/', addEntry);

/**
 * @route PATCH /entries/:id
 * @description Update a specific entry by ID
 * @param req.params entry ID: String
 */
router.patch('/:id', updateEntry);

module.exports = router;
