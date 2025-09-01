
import argon2 from "argon2";

/**
 * Verifies if the provided plain text password matches the stored hash.
 * @param {string} plainPassword - The plain text password to verify.
 * @param {string} hashedPassword - The hashed password stored in the database.
 * @returns {Promise<boolean>} true if the password is valid, false otherwise.
 */
export async function verifyPassword(plainPassword, hashedPassword) {
	try {
		return await argon2.verify(hashedPassword, plainPassword);
	} catch (err) {
    console.log(err);
		return false;
	}
}
