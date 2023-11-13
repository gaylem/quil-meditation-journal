const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
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

// static signup method
userSchema.statics.signup = async function (username, email, password) {
  // validation
  if (!username || !email || !password) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough');
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ username, email, password: hash });

  return user;
};

// static login method
userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error('All fields must be filled');
  }
  const user = await this.findOne({ username });
  console.log('User found:', user);

  if (!user) {
    throw Error('Incorrect username');
  }

  const match = await bcrypt.compare(password, user.password);

  console.log(match);

  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

module.exports = {
  Entry: mongoose.model('Entry', entrySchema),
  User: mongoose.model('User', userSchema),
  Session: mongoose.model('Session', sessionSchema),
};
