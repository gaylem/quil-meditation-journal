//* ENCRYPT DECRYPT UTILS */

import dotenv from 'dotenv';

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

dotenv.config();

const algorithm = 'aes-256-cbc';

/**
 * Encrypts the given text using AES-256-CBC algorithm and a unique IV.
 *
 * @param {string} text - The text to be encrypted.
 * @returns {Object} An object containing the IV and the encrypted data.
 * @throws {Error} Throws an error if encryption fails.
 */
export function encrypt(text, key = process.env.ENCRYPTION_KEY) {
  try {
    // Generate a random IV for each encryption
    const iv = randomBytes(16);
    // Create cipher
    const cipher = createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    // Return an object containing the IV and the encrypted data
    return { iv: iv.toString('hex'), encryptedData: encrypted };
  } catch (error) {
    throw error;
  }
}

/**
 * Decrypts the given encrypted text using the provided IV.
 *
 * @param {string} encryptedText - The text to be decrypted.
 * @param {string} decryptionIv - The IV used for decryption.
 * @returns {string} The decrypted text.
 * @throws {Error} Throws an error if decryption fails.
 */
export function decrypt(encryptedText, decryptionIv, key = process.env.ENCRYPTION_KEY) {
  try {
    // Convert the IV from hex string to Buffer
    const iv = Buffer.from(decryptionIv, 'hex');
    // Decrypt the encrypted text
    const decipher = createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText, 'hex');
    decrypted += decipher.final('utf-8');
    // Return decrypted text
    return decrypted;
  } catch (error) {
    throw error;
  }
}
