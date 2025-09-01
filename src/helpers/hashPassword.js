import argon2 from "argon2"; 

/**
 * Hashes a plain text password using Argon2 algorithm.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} The hashed password string.
 */
export default async function hashPassword(password) {
  return await argon2.hash(password);
}