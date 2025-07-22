import request from 'supertest';
import app from '../../app';
import {SignupBody} from "@src/routes/auth/signup";
import {initDatabase} from "@src/db/database";
import validateEnv from "@src/utils/env";
import {LoginBody} from "@src/routes/auth/login";
import {TokenBody} from "@src/routes/auth/token"; // Adjust the path to your app

beforeAll(() => {
    validateEnv();
    initDatabase();
});

let refreshToken: string;

describe('Auth endpoints', () => {
    const testUser: SignupBody = {
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'securePass123'
    };

    describe('Signup endpoint', () => {
        it('should return 201 for valid signup data', async () => {
            const response = await request(app)
                .post('/auth/signup')
                .send(testUser);

            expect(response.status).toBe(201);
            // Must have a message and data should be the refresh token
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('refreshToken');

            refreshToken = response.body.refreshToken;
        });

        it('should return 400 for invalid data', async () => {
            const invalidData = {
                email: 'invalid-email',
                username: '',
                password: '123'
            };
            const response = await request(app)
                .post('/auth/signup')
                .send(invalidData);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Invalid data');
        });

        it('should return 400 if user already exists', async () => {
            const response = await request(app)
                .post('/auth/signup')
                .send(testUser);

            expect(response.status).toBe(400); // or 409 depending on your logic
            expect(response.body.details).toMatch(/already exists/i);
        });
    });

    describe('Login', () => {
        it('should login with email and return refresh token', async () => {
            const body: LoginBody = {
                identifier: testUser.email,
                password: testUser.password
            };
            const response = await request(app)
                .post('/auth/login')
                .send(body);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('refreshToken');

            refreshToken = response.body.data.refreshToken;
        });

        it('should login with username and return refresh token', async () => {
            const body: LoginBody = {
                identifier: testUser.username,
                password: testUser.password
            };
            const response = await request(app)
                .post('/auth/login')
                .send(body);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('refreshToken');

            refreshToken = response.body.data.refreshToken;
        });

        it('should fail with wrong password', async () => {
            const body: LoginBody = {identifier: testUser.email, password: 'wrongPassword'};

            const response = await request(app)
                .post('/auth/login')
                .send(body);

            expect(response.status).toBe(401);
            expect(response.body.message).toMatch(/invalid/i);
        });

        it('should fail if user does not exist', async () => {
            const body: LoginBody = {identifier: 'nonexistent@example.com', password: 'whatever'};
            const response = await request(app)
                .post('/auth/login')
                .send(body);

            expect(response.status).toBe(401);
            expect(response.body.message).toMatch(/invalid/i);
        });
    });

    describe('Access Token', () => {
        it('should return a valid access token from a refresh token', async () => {
            const body: TokenBody = {refreshToken};
            const response = await request(app)
                .post('/auth/token')
                .send(body);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('accessToken');
        });

        it('should reject a malformed refresh token', async () => {
            const body: TokenBody = {refreshToken: 'invalid-token'};
            const response = await request(app)
                .post('/auth/token')
                .send(body);

            // Validation errors have status code 400
            expect(response.status).toBe(400);
            expect(response.body.success).toEqual(false);
        });

        it('should reject an invalid refresh token', async () => {
            const body: TokenBody = {
                refreshToken: "DEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF"
            };

            const response = await request(app)
                .post('/auth/token')
                .send(body);

            expect(response.status).toBe(401);
            expect(response.body.success).toEqual(false);
        });
    });
});