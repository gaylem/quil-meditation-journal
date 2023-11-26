const model = require('../db/models');
const entryController = {};

/**
 * Retrieves all entries for a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response containing all entries for the user or an error response.
 */
entryController.getAllEntries = async (_, res) => {
  try {
    // Store userId in variable
    const userId = res.locals.decoded.id;
    // Call database to request all entries from user
    const allEntries = await model.Entry.find({ userId });
    // If nothing is returned, log an error
    if (!allEntries || allEntries.length === 0) {
      return res.status(404).json({
        log: 'entryController.getAllEntries: No entries found for the user',
        status: 404,
        message: { error: 'Entries not found' },
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
      message: { error: 'Internal Server Error' },
    });
  }
};

/**
 * Adds a new entry.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response containing the new entry or an error response.
 */
entryController.addEntry = async (req, res) => {
  try {
    // Extract the entry body and userId from the request body
    const { body, userId } = req.body;
    // Create new entry in database and store response in a variable
    const newEntry = await model.Entry.create({ body, userId });
    if (!newEntry || newEntry.length === 0) {
      return res.status(404).json({
        log: 'entryController.addEntry: New entry not found',
        status: 404,
        message: { error: 'Entry not found' },
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
      message: { error: 'Internal Server Error' },
    });
  }
};

/**
 * Finds one entry by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response containing the found entry or an error response.
 */
// TODO: Find one entry by id (is this even needed?)
entryController.findEntry = async (req, res) => {
  try {
    const entryId = req.params.id;
    const foundEntry = await model.Entry.findOne({ _id: entryId });

    if (!foundEntry || foundEntry.length === 0) {
      return res.status(404).json({
        log: 'entryController.findEntry: Entry not found',
        status: 404,
        message: { error: 'Entry not found' },
      });
    }
    res.locals.entry = foundEntry;
    return res.status(200).json(res.locals.entry);
  } catch (error) {
    return res.status(500).json({
      log: `entryController.findEntry: ERROR ${error}`,
      status: 500,
      message: { error: 'Internal Server Error' },
    });
  }
};

/**
 * Updates an entry by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response containing the updated entry or an error response.
 */
entryController.updateEntry = async (req, res) => {
  try {
    // Store request parameter in a variable
    const _id = req.params.id;
    // Extract the entry body and userId from the request body
    const { body, userId } = req.body;
    // Find and update entry in database and store updated entry in a variable
    const updatedEntry = await model.Entry.findOneAndUpdate({ _id }, { body, userId }, { new: true });
    if (!updatedEntry || updatedEntry.length === 0) {
      return res.status(404).json({
        log: 'entryController.updatedEntry: Entry not found for update',
        status: 404,
        message: { error: 'An error occurred' },
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
      message: { error: 'Internal Server Error' },
    });
  }
};

/**
 * Deletes an entry by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response containing the deleted entry or an error response.
 */
entryController.deleteEntry = async (req, res) => {
  try {
    // Store parameter as a variable
    const entryId = req.params.id;
    // Find and delete entry and store response in a variable
    const deletedEntry = await model.Entry.findOneAndDelete({ _id: entryId });
    // If response returns false, throw an error
    if (!deletedEntry || deletedEntry.length === 0) {
      return res.status(404).json({
        log: 'entryController.deleteEntry: Entry not found for deletion',
        status: 404,
        message: { error: 'Entry not found' },
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
      message: { error: 'Internal Server Error' },
    });
  }
};

module.exports = entryController;
