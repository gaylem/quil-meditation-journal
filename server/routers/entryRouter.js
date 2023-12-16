//** ENTRY ROUTER */

/* This router handles all entry-related functions for an individual user's account. It includes: 
    1. GET getAllEntries by userId
    2. POST addEntry byuserId
    3. PATCH updateEntry by entry _id
    4. DELETE deleteEntry by entry _id

    User is authenticated with authMiddleware when all routers are called before executing the controller.
*/

import express from 'express';
const router = express.Router();

import entryController from '../controllers/entryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

// Destructure the functions if needed
const { getAllEntries, addEntry, updateEntry, deleteEntry } = entryController;

/**
 * @route GET /entries/:id
 * @description Get all entries for a specific user
 * @param req.params userId
 */
router.get('/:id', authMiddleware, getAllEntries);

/** // TODO: Update this to send userId in req.param instead of req.body
 * @route POST /entries/
 * @description Create a new entry
 * @param {Object} req - The requst object containing:
 *  - body: String
 *  - userId: String
 */
router.post('/', authMiddleware, addEntry);

/**
 * @route PATCH /entries/:id
 * @description Update a specific entry
 * @param req.params entry _id
 */
router.patch('/:id', authMiddleware, updateEntry);

/**
 * @route DELETE /entries/:id
 * @description Delete a specific entry
 * @param req.params entry _id
 */
router.delete('/:id', authMiddleware, deleteEntry);

export default router;
