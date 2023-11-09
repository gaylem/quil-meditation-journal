const mongoose = require('mongoose');
require('dotenv');

mongoose
  .connect(process.env.MONGODB_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'quil_app',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

const entrySchema = new Schema(
  {
    body: { type: String, required: true },
  },
  { timestamps: true },
);

const Entry = mongoose.model('entry', entrySchema);

module.exports = { Entry };
