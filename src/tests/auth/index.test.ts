import request from 'supertest';
import app from '../../app';
import {SignupBody} from "@src/routes/auth/signup";
import {initDatabase} from "@src/db/database";
import validateEnv from "@src/utils/env"; // Adjust the path to your app

beforeAll(() => {
    validateEnv()
    initDatabase()
});

describe('Signup endpoint', () => {
    it('should return 201 for valid signup data', async () => {
        const validData: SignupBody = {
            email: 'test@test.com',
            username: 'testuser',
            password: 'password123'
        };
        const response = await request(app)
            .post('/auth/signup')
            .send(validData);

        console.log(response.body);
        expect(response.status).toBe(201);
        // Must have message and data should be the refresh token
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('refreshToken');
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
});