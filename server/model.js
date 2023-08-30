const mongoose = require('mongoose');

const MONGO_URI =
    'mongodb+srv://hellogmartin:YH8RshIUeh6sst2d@cluster0.yhyya61.mongodb.net/?retryWrites=true&w=majority';

mongoose
    .connect(MONGO_URI, {
        // options for the connect method to parse the URI
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // sets the name of the DB that our collections are part of
        dbName: 'quil_app'
    })
    .then(() => console.log('Connected to Mongo DB.'))
    .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const entrySchema = new Schema({
    date: { type: Date, required: true },
    body: { type: String, required: true }
});

const Entry = mongoose.model('entry', entrySchema);

module.exports = { Entry };
