const model = require('./model');
const entryController = {};

// CREATE
entryController.addEntry = (req, res, next) => {
    const { date, body } = req.body;
    model.Entry.create({ date, body })
        .then((response) => {
            console.log(response);
            return next();
        })
        .catch((err) => console.log(err));
};

// READ ALL
entryController.getAllEntries = (req, res, next) => {
    model.Entry.find({})
        .then((data) => {
            res.locals.allEntries = data;
            return next();
        })
        .catch((err) => console.log(err));
};

// TODO: READ ONE
// entryController.findEntry = (req, res, next) => {
//     const id = req.params.id;
//     model.Entry.findOne({ _id: id })
//         .then((res) => {
//             res.locals.entry = res;
//             console.log(res.locals.entry);
//             next();
//         })
//         .catch((err) => {
//             return next({
//                 log: `entryController.updateEntry : ERROR ${err}`,
//                 status: 404,
//                 message: { err: 'An error occurred' }
//             });
//         });
// };

// UPDATE
entryController.updateEntry = (req, res, next) => {
    const { _id } = req.params;
    const { body } = req.body;
    const newBody = { body };

    model.Entry.findOneAndUpdate(_id, newBody, { returnOriginal: false })
        .then((data) => {
            console.log('updated data: ', data);
            res.locals.updatedEntry = data;
            return next();
        })
        .catch((err) => {
            return next({
                log: `entryController.updateEntry : ERROR ${err}`,
                status: 400,
                message: { err: 'An error occurred' }
            });
        });
};

// DELETE
entryController.deleteEntry = (req, res, next) => {
    const id = req.params.id;
    model.Entry.findOneAndDelete({ _id: id })
        .then((data) => {
            res.locals.deletedEntry = data;
            return next();
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
