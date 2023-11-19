const express = require('express');
const entryController = require('../controllers/entryController');
const userController = require('../controllers/userController');
const router = express.Router();

// Route for getting all entries data
router.get('/', userController.verifyAccessToken, entryController.getAllEntries, (req, res) => {
  return res.status(200).json(res.locals.allEntries);
});

// Route for getting specific entries data
router.get('/:id', (req, res) => {
  return res.status(200).json(res.locals.entry);
});

// Route for deleting specific entries
router.delete('/:id', entryController.deleteEntry, (req, res) => {
  return res.status(200).json(res.locals.deleteEntry);
});

// Route for creating new entries
router.post('/', entryController.addEntry, (req, res) => {
  return res.status(201).json(res.locals.newEntry);
});

// Route for updating specific entries
router.patch('/:id', entryController.updateEntry, (req, res) => {
  return res.status(200).json(res.locals.updatedEntry);
});

module.exports = router;
