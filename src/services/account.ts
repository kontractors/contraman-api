import {database} from "@src/db/database";
import type {Account, AuthCredential} from "db";
import {Selectable, Transaction} from "kysely";
import argon2 from "argon2";
import {DB} from "../../types/db";
import * as jwt from "jsonwebtoken";

export async function createAccessToken(refreshToken: string) {
    // Make sure there is an account associated with this token.
    const account = await getAccountByRefreshToken(refreshToken);
    if (!account) {
        throw new Error("Invalid refresh token");
    }

    // Check account status
    if (account.status == 'banned') {
        throw new Error("Account banned!");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('Cannot sign the token');
    }

    const payload = {id: account.id};

    return jwt.sign(payload, secret, {
        algorithm: 'HS512',
        expiresIn: '15m',
    });
}

export async function getAccountByRefreshToken(token: string): Promise<Selectable<Account>> {
    return database.selectFrom('account')
        .selectAll()
        .where('refresh_token', '=', token)
        .executeTakeFirstOrThrow();
}

export async function getAccountById(accountId: string): Promise<Selectable<Account>> {
    return await database.selectFrom('account')
        .selectAll()
        .where('id', '=', accountId)
        .executeTakeFirstOrThrow();
}

export async function getPasswordCredential(accountId: string) {
    const credential = await database.selectFrom('auth_credential')
        .selectAll()
        .where('account_id', '=', accountId)
        .where('auth_type', '=', "local-password")
        .executeTakeFirstOrThrow();
    if (!credential) {
        throw new Error('Authentication credential not found.');
    }

    // Update the type for the credential, so its credential_data is typed correctly
    return credential as (Selectable<AuthCredential> & { credential_data: { password: string } });
}

export async function setPasswordCredential(accountId: string, password: string, trx?: Transaction<DB>) {
    const db = trx || database;

    const hashedPassword = await argon2.hash(password);
    const credentialData = {password: hashedPassword};

    // update or insert the password credential
    await db.insertInto('auth_credential')
        .values({
            account_id: accountId,
            auth_type: "local-password",
            credential_data: credentialData
        })
        .onConflict((oc) => oc.columns(['account_id', 'auth_type']).doUpdateSet({
            credential_data: credentialData
        }))
        .execute();
}

export async function loginWithEmail(email: string, password: string) {
    return loginByField('email', email, password);
}

export async function loginWithUsername(username: string, password: string) {
    return loginByField('username', username, password);
}

export async function loginWithPhone(phone: string, password: string) {
    return loginByField('phone', phone, password);
}

async function loginByField(field: 'email' | 'username' | 'phone', value: string, password: string): Promise<string> {
    const user = await database.selectFrom('user_profile')
        .selectAll()
        .where(field, '=', value)
        .executeTakeFirst();

    if (!user) throw new Error(`Invalid ${field} or password.`);

    const account = await getAccountById(user.id);
    const cred = await getPasswordCredential(account.id);

    const isValid = await argon2.verify(cred.credential_data.password, password);
    if (!isValid) {
        throw new Error(`Invalid ${field} or password.`);
    }

    return account.refresh_token;
}
