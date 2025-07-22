import {database} from "@src/db/database";
import logger from "@src/utils/logger";
import type {UserProfile} from "../../types/db";
import {Insertable} from "kysely";
import * as AccountService from "@src/services/account";

// Creates a new user with the given email, username, and password.
// If the user already exists, it throws an error.
// Returns the refresh token for the newly created user.
export async function createNewUser(email: string, username: string, password: string): Promise<string> {
    return await database.transaction().execute(async trx => {
        // Check if the email or username already exists
        const user = await trx.selectFrom('user_profile')
            .selectAll()
            .where(eb => eb.or([
                eb('email', '=', email),
                eb('username', '=', username)
            ]))
            .executeTakeFirst();
        if (user) {
            throw new Error('User already exists with the provided email or username.');
        }

        // 1. First create the account
        const {id, refresh_token} = await trx.insertInto('account')
            .defaultValues()
            .returning(['id', 'refresh_token'])
            .executeTakeFirstOrThrow();
        if (!id || !refresh_token) {
            throw new Error('Failed to create account. Please try again later.');
        }

        const userProfile: Insertable<UserProfile> = {
            id,
            username,
            email,
            name: username
        };
        await trx.insertInto('user_profile')
            .values(userProfile)
            .executeTakeFirstOrThrow();

        // 2. Create local-password auth credential
        await AccountService.setPasswordCredential(id, password, trx);

        logger.info(`User created successfully with ID: ${id}`);

        return refresh_token;
    });
}