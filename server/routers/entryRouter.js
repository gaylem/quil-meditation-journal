//** ENTRY ROUTER */

/* This router handles all entry-related functions for an individual user's account. It includes: 
    1. GET getAllEntries by userId
    2. POST addEntry byuserId
    3. PATCH updateEntry by entry _id
    4. DELETE deleteEntry by entry _id

    User is authenticated with authMiddleware before getAllEntries and addEntry routers are called.
*/

import express from 'express';
const router = express.Router();

import entryController from '../controllers/entryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

// Destructure the entryController functions
const { getAllEntries, addEntry, updateEntry, deleteEntry } = entryController;

/**
 * @route GET /entries/:id
 * @description Get all entries for a specific user
 * @param req.params userId
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Request to /api/entries/:id with ID:', req.params.id);

    // Call your controller function
    const result = await getAllEntries(req.params.id); // pass any required parameters

    // Respond based on the result from the controller
    res.status(200).json(result);
  } catch (error) {
    // Handle errors appropriately
    console.error('Error in /api/entries/:id route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route POST /entries/
 * @description Add new entry for a specific user
 * @param req.params userId
 * @param {Object} req.body New entry content
 */
router.post('/:id', authMiddleware, addEntry);

/**
 * @route PATCH /entries/:id
 * @description Update entry for a specific user
 * @param req.params userId
 * @param req.body entry _id
 */
router.patch('/:id', authMiddleware, updateEntry);

/**
 * @route DELETE /entries/:id
 * @description Delete entry for a specific user
 * @param req.params entry _id
 */
router.delete('/:id', authMiddleware, deleteEntry);

export default router;
