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

// ENTRY SCHEMA
const entrySchema = new Schema(
  {
    body: { type: String, required: true },
  },
  { timestamps: true },
);

const Entry = mongoose.model('entry', entrySchema);

// USER SCHEMA
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true },
);

const User = mongoose.model('user', userSchema);

// SESSION SCHEMA
const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: User, required: true },
    cookieId: String,
  },
  { timestamps: true },
);

const Session = mongoose.model('session', sessionSchema);

module.exports = { Entry, Session, User };
