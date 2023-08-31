const model = require('./model');
const entryController = {};

// CREATE
entryController.addEntry = (req, res, next) => {
    const { date, body } = req.body;
    model.Entry.create({ date, body })
        .then((response) => {
            console.log(response);
            next();
        })
        .catch((err) => console.log(err));
};

// READ
entryController.getAllEntries = (req, res, next) => {
    model.Entry.find({})
        .then((data) => {
            res.locals.allEntries = data;
            return next();
        })
        .catch((err) => console.log(err));
};

// UPDATE
entryController.updateEntry = (req, res, next) => {
    const id = req.params.id;
    const newBody = req.params.body;
    console.log(newBody);
    model.Entry.updateOne({ _id: id }, { $set: { body: newBody } })
        .then((res) => {
            next();
        })
        .catch((err) => {
            return next({
                log: `entryController.updateEntry : ERROR ${err}`,
                status: 500,
                message: { err: 'An error occurred' }
            });
        });
};

// DELETE
entryController.deleteEntry = (req, res, next) => {
    const id = req.params.id;
    model.Entry.findOneAndDelete({ _id: id })
        .then((res) => {
            next();
        })
        .catch((err) => {
            return next({
                log: `entryController.deleteEntry : ERROR ${err}`,
                status: 500,
                message: { err: 'An error occurred' }
            });
        });
};
module.exports = entryController;
