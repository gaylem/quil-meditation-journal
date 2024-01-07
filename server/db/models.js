//** DATABASE MODELS */

// Imports
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

async function connectToDatabase() {
  try {
    let options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'quil_app',
    };

    if (process.env.NODE_ENV === 'production') {
      const fixieData = process.env.FIXIE_SOCKS_HOST.split(new RegExp('[/(:\\/@/]+'));

      options = {
        ...options,
        auth: {
          user: fixieData[0],
          password: fixieData[1],
        },
        proxy: {
          host: fixieData[2],
          port: parseInt(fixieData[3]),
        },
      };
    }

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('Connected to MongoDB.');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process if connection fails
  }
}

// Invoke function to connect to database
connectToDatabase();

// Create a shorthand for the mongoose Schema class
const Schema = mongoose.Schema;

//* Entry Schema */
const entrySchema = new Schema(
  {
    body: { type: String, required: true }, // This is the content of the meditation session entry
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference the "User" model for the "userId" field
    iv: { type: String, required: true },
  },
  { timestamps: true }, // Automatically generate "createdAt" and "updatedAt" timestamps
);

//* User Schema */
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    refreshTokens: [{ type: String }], // Refresh tokens for authentication
  },
  { timestamps: true }, // Automatically generate "createdAt" and "updatedAt" timestamps
);

// Export Entry and User schemas
export const Entry = mongoose.model('Entry', entrySchema);
export const User = mongoose.model('User', userSchema);
