require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Login API', () => {

    test('should return 400 if email is missing', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ password: '123456' });

        expect(response.status).toBe(400);
    });

    test('should return 401 for wrong password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'hiteshrelwani6@gmail.com', password: '123489' });

        expect(response.status).toBe(401);
    });

    test('should return 200 and a token for valid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'hiteshrelwani6@gmail.com', password: '123456' });

        expect(response.status).toBe(200);
    });

});