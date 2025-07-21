import argon2 from "argon2";
import {database} from "@src/db/database";
import logger from "@src/utils/logger";
import {AuthCredential, UserProfile} from "../../types/db";
import {Insertable} from "kysely";

// Creates a new user with the given email, username, and password.
// If the user already exists, it throws an error.
// Returns the refresh token for the newly created user.
export async function createNewUser(email: string, username: string, password: string): Promise<string> {
    // Check if the email or username already exists
    const user = await database.selectFrom('user_profile')
        .selectAll()
        .where(eb => eb.or([
            eb('email', '=', email),
            eb('username', '=', username)
        ]))
        .executeTakeFirst();

    if (user) {
        throw new Error('User already exists with the provided email or username.');
    }

    // 0. Hash the password
    const hashedPassword = await argon2.hash(password);

    // 1. First create the account
    const {id, refresh_token} = await database.insertInto('account').defaultValues().returning(['id', 'refresh_token']).executeTakeFirstOrThrow();

    const userProfile: Insertable<UserProfile> = {
        id,
        username,
        email,
        name: username
    }
    await database.insertInto('user_profile').values(userProfile).executeTakeFirstOrThrow()

    // 2. Create local-password auth credential
    const credential: Insertable<AuthCredential> = {
        account_id: id,
        auth_type: "local-password",
        credential_data: {
            password: hashedPassword
        }
    }
    await database.insertInto('auth_credential').values(credential).executeTakeFirstOrThrow();

    logger.info(`User created successfully with ID: ${id}`);

    return refresh_token
}