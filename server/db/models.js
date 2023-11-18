const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
require('dotenv');

//* Connect to DB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'quil_app',
    });
    console.log('Connected to Mongo DB.');
  } catch (err) {
    console.log(err);
  }
}

connectToDatabase();

//* Create Schema
const Schema = mongoose.Schema;

//* ENTRY SCHEMA
const entrySchema = new Schema(
  {
    body: { type: String, required: true },
  },
  { timestamps: true },
);

//* USER SCHEMA
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true },
);

//* SIGNUP METHOD
userSchema.statics.signup = async function (username, email, password) {
  if (!username || !email || !password) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid');
  }

  /* Check if the string can be considered a strong password or not. 
      Allows for custom requirements or scoring rules. 
      If returnScore is true, then the function returns an integer score for the password rather than a boolean.

      Default options: { 
        minLength: 8, 
        minLowercase: 1, 
        minUppercase: 1, 
        minNumbers: 1, 
        minSymbols: 1, 
        returnScore: false, 
        pointsPerUnique: 1, 
        pointsPerRepeat: 0.5, 
        pointsForContainingLower: 10, 
        pointsForContainingUpper: 10, 
        pointsForContainingNumber: 10, 
        pointsForContainingSymbol: 10 
      }
  */

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

//* LOGIN METHOD
userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error('All fields must be filled');
  }
  const user = await this.findOne({ username });

  if (!user) {
    throw Error('Incorrect username');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

//* EXPORTS
module.exports = {
  Entry: mongoose.model('Entry', entrySchema),
  User: mongoose.model('User', userSchema),
};
