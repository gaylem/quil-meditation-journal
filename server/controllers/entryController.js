const model = require('../db/models');
const entryController = {};

// READ ALL
entryController.getAllEntries = (req, res, next) => {
  const userId = res.locals.decoded.id;

  model.Entry.find({ userId })
    .then(data => {
      res.locals.allEntries = data;
      console.log('res.locals.allEntries: ', res.locals.allEntries);

      return next();
    })
    .catch(err => console.log(err));
};

// CREATE
entryController.addEntry = (req, res, next) => {
  const { body, userId } = req.body;
  console.log(req.body);

  model.Entry.create({ body, userId })
    .then(response => {
      res.locals.newEntry = response;
      return next();
    })
    .catch(err => console.log(err));
};

// TODO: READ ONE
entryController.findEntry = (req, res, next) => {
  const id = req.params.id;
  console.log('id: ', id);
  model.Entry.findOne({ _id: id })
    .then(foundEntry => {
      // Use a different name here, e.g., foundEntry
      res.locals.entry = foundEntry;
      console.log(res.locals.entry);
      next();
    })
    .catch(err => {
      return next({
        log: `entryController.findEntry: ERROR ${err}`,
        status: 404,
        message: { err: 'An error occurred' },
      });
    });
};

// UPDATE
entryController.updateEntry = (req, res, next) => {
  const { _id } = req.params;
  const { body } = req.body;
  const newBody = { body };

  model.Entry.findOneAndUpdate(_id, newBody, { returnOriginal: false })
    .then(data => {
      console.log('data: ', data);
      res.locals.updatedEntry = data;
      return next();
    })
    .catch(err => {
      return next({
        log: `entryController.updateEntry : ERROR ${err}`,
        status: 400,
        message: { err: 'An error occurred' },
      });
    });
};

// DELETE
entryController.deleteEntry = (req, res, next) => {
  const id = req.params.id;
  model.Entry.findOneAndDelete({ _id: id })
    .then(data => {
      res.locals.deletedEntry = data;
      console.log('data: ', data);
      return next();
    })
    .catch(err => {
      return next({
        log: `entryController.deleteEntry : ERROR ${err}`,
        status: 500,
        message: { err: 'An error occurred' },
      });
    });
};

module.exports = entryController;
