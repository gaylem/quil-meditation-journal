const express = require('express');
const entryController = require('./controller');
const router = express.Router();

// Route for getting all entries data
router.get('/', entryController.getAllEntries, (req, res) => {
    return res.status(200).json(res.locals.allEntries);
});

// Route for getting specific entries data
router.get('/:id', (req, res) => {
    const id = req.params.id;
});

// Route for deleting specific entries
router.delete('/:id', (req, res) => {});

// Route for creating new entries
router.post('/', entryController.addEntry, (req, res) => {
    return res.status(201).send('you did it!');
});

// Route for updating specific entries
router.put('/:id', (req, res) => {
    const itemId = req.params.id;
    const updatedItem = req.body;
});

module.exports = router;
