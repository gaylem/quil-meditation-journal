//** ENTRY CONTROLLER */

/* Includes: 
    1. getAllEntries (GET /users) - Retrieves all entries for a user
    2. logoutUser (POST /logout) - Logs a user out by removing the provided refresh token from the database
    3. createUser (POST /signup) - Creates a new user in the database
*/

// Imports
import { Entry } from '../db/models.js';
const entryController = {};

/**
 * @route GET /api/entries
 * @description Retrieves all entries for a user
 * @param {Object} res - The response object (Array of objects)
 * @returns {Object} - JSON response containing all entries for the user or an error response
 */
entryController.getAllEntries = async (req, res) => {
  try {
    // Store userId in variable
    const userId = req.params.id;
    // Call database to request all entries from user
    const allEntries = await Entry.find({ userId });
    // If nothing is returned, log an error
    if (!allEntries) {
      return res.status(404).json({
        log: 'entryController.getAllEntries: No entries found for the user',
        status: 404,
        message: 'Your entries could not be found.',
      });
    }
    // If result is returned, store in locals object
    res.locals.allEntries = allEntries;
    // Return allEntries
    return res.status(200).json(res.locals.allEntries);
  } catch (error) {
    return res.status(500).json({
      log: `entryController.getAllEntries: ERROR ${error}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * @route POST /api/entries/
 * @description Adds a new entry to the database
 * @param {Object} req - The request object
 *  - body (content of meditation journal entry): String
 *  - userId: Integer
 * @param {Object} res - The response object
 * @returns {Object} - JSON response containing the new entry or an error response.
 */
entryController.addEntry = async (req, res) => {
  try {
    // Extract the entry body and userId from the request body
    const { body, userId } = req.body;
    // Create new entry in database and store response in a variable
    const newEntry = await Entry.create({ body, userId });
    // Handle errors
    if (!newEntry || newEntry.length === 0) {
      return res.status(404).json({
        log: 'entryController.addEntry: newEntry not found.',
        status: 404,
        message: 'There was an issue adding your entry.',
      });
    }
    // Store response on locals object
    res.locals.newEntry = newEntry;
    // Return the newEntry
    return res.status(201).json(res.locals.newEntry);
  } catch (error) {
    return res.status(500).json({
      log: `entryController.addEntry: ERROR ${error}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * @route GET /api/entries/:id
 * @description Finds one entry by ID
 * @param req.params _id of the entry to be found
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - JSON response containing the found entry or an error response
 */
// TODO: Find one entry by id (is this even needed?)
entryController.findEntry = async (req, res) => {
  try {
    const entryId = req.params.id;
    const foundEntry = await Entry.findOne({ _id: entryId });

    if (!foundEntry || foundEntry.length === 0) {
      return res.status(404).json({
        log: 'entryController.findEntry: foundEntry not found.',
        status: 404,
        message: 'Your entry could not found.',
      });
    }
    res.locals.entry = foundEntry;
    return res.status(200).json(res.locals.entry);
  } catch (error) {
    return res.status(500).json({
      log: `entryController.findEntry: ERROR ${error}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * @route PATCH /api/entries/:id
 * @description Updates an entry by ID
 * @param req.params _id of the entry to be updated
 * @param {Object} req - The request object
 *  - body (content of meditation journal entry): String
 *  - userID: Integer
 * @param {Object} res - The response object
 * @returns {Object} - JSON response containing the updated entry or an error response
 */
entryController.updateEntry = async (req, res) => {
  try {
    // Store request parameter in a variable
    const _id = req.params.id;
    // Extract the entry body and userId from the request body
    const { body, userId } = req.body;
    // Find and update entry in database and store updated entry in a variable
    const updatedEntry = await Entry.findOneAndUpdate({ _id }, { body, userId }, { new: true });
    if (!updatedEntry || updatedEntry.length === 0) {
      return res.status(404).json({
        log: 'entryController.updatedEntry: updatedEntry not found.',
        status: 404,
        message: 'Your entry could not be updated.',
      });
    }
    // Store updated entry in locals object
    res.locals.updatedEntry = updatedEntry;
    // Return the updatedEntry
    return res.status(200).json(res.locals.updatedEntry);
  } catch (error) {
    return res.status(500).json({
      log: `entryController.updateEntry: ERROR ${error}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * @route /api/entries/:id
 * @description Deletes an entry by ID.
 * @param req.params - _id of the entry to be deleted
 * @param {Object} res - The response object
 * @returns {Object} - JSON response containing the deleted entry or an error response
 */
entryController.deleteEntry = async (req, res) => {
  try {
    // Store parameter as a variable
    const entryId = req.params.id;
    // Find and delete entry and store response in a variable
    const deletedEntry = await Entry.findOneAndDelete({ _id: entryId });
    // If response returns false, throw an error
    if (!deletedEntry || deletedEntry.length === 0) {
      return res.status(404).json({
        log: 'entryController.deleteEntry: deletedEntry not found.',
        status: 404,
        message: 'Your entry could not be deleted.',
      });
    }
    // If response returns true, store in locals object
    res.locals.deletedEntry = deletedEntry;
    // Return deletedEntry
    return res.status(200).json(res.locals.deletedEntry);
  } catch (error) {
    return res.status(500).json({
      log: `entryController.deleteEntry: ERROR ${error}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

export default entryController;
