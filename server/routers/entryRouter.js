//** ENTRY ROUTER */

/* This router handles all entry-related functions for an individual user's account. It includes: 
    1. GET /api/entries/:id => getAllEntries
    2. POST /api/entries/:id => addEntry 
    3. PATCH /api/entries/:id => updateEntry
    4. DELETE /api/entries/:id => deleteEntry
*/

const express = require('express');
const router = express.Router();

// Entry controllers
const { getAllEntries, addEntry, updateEntry, deleteEntry } = require('../controllers/entryController');

/**
 * @route GET /entries/:id
 * @description Get all entries for a specific user
 * @param req.params userId: String
 */
router.get('/:id', getAllEntries);

/**
 * @route POST /entries/:id
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

/**
 * @route DELETE /entries/:id
 * @description Delete a specific entry by ID
 * @param req.params entry ID: String
 */
router.delete('/:id', deleteEntry);


module.exports = router;
