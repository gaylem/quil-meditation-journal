const model = require('./model');
const entryController = {};

entryController.getAllEntries = (req, res, next) => {
    model.Entry.find({})
        .then((data) => {
            res.locals.allEntries = data;
            return next();
        })
        .catch((err) => console.log(err));
};

entryController.addEntry = (req, res, next) => {
    const { date, body } = req.body;
    model.Entry.create({ date, body })
        .then((response) => {
            console.log(response);
            next();
        })
        .catch((err) => console.log(err));
};

module.exports = entryController;
