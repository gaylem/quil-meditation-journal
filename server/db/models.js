//** DATABASE MODELS */

// Imports
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

// Connect to MongoDB database
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
