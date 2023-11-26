const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

//* User Schema
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    refreshTokens: [{ type: String }],
  },
  { timestamps: true },
);

//* Entry Schema
const entrySchema = new Schema(
  {
    body: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

//* Create Token
userSchema.statics.createToken = obj => {
  try {
    if (typeof obj !== 'object') {
      throw new Error('Input must be an object');
    }

    if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
      throw Error('Secret keys are missing');
    }

    // TODO: Commenting out lines with expirations to see if that fixes my issues
    // const accessToken = jwt.sign(obj, process.env.ACCESS_SECRET, { expiresIn: '15m' });

    // const refreshToken = jwt.sign(obj, process.env.REFRESH_SECRET, { expiresIn: '7d' });

    const accessToken = jwt.sign(obj, process.env.ACCESS_SECRET, { algorithm: 'HS256' });

    const refreshToken = jwt.sign(obj, process.env.REFRESH_SECRET, { algorithm: 'HS256' });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error creating token:', error);
    throw Error('Failed to create token');
  }
};

//* Signup Method
userSchema.statics.signup = async function (username, email, password) {
  try {
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
    console.log('exists: ', exists);

    if (exists) {
      throw Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new this({ username, email, password: hash });
    await user.save();
    return {
      id: user._id.toString(),
      username: user.username,
    };
  } catch (error) {
    console.error('Error creating user in the database:', error);
    throw error;
  }
};

//* Login Method
userSchema.statics.login = async function (username, password) {
  try {
    if (!username || !password) {
      throw new Error('All fields must be filled');
    }
    const user = await this.findOne({ username });

    if (!user) {
      throw new Error('Incorrect username or password');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error('Incorrect password');
    }
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

//* Logout Method
userSchema.statics.logout = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    // Find the user by refresh token and remove it
    const user = await User.findOneAndUpdate({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } }, { new: true });

    if (!user) {
      throw Error('Invalid refresh token');
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//* Exports
module.exports = {
  Entry: mongoose.model('Entry', entrySchema),
  User: mongoose.model('User', userSchema),
};
