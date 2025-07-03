const request = require('supertest');
const app = require('../app'); // Your Express app

describe('POST /api/courses', () => {
    it('should create a new course', async () => {
        const response = await request(app)
            .post('/api/courses')
            .send({
                title: 'Intro to JavaScript',
                description: 'A beginner course for learning JavaScript.',
                instructor: '60a77b2ff68f5e00156b3b4d', // Replace with valid ObjectId
                modules: ['60a77b9ff68f5e00156b3b50'], // Replace with valid ObjectId
                category: 'Programming',
                level: 'Beginner'
            })
            .expect(201);

        expect(response.body.status).toBe('success');
        expect(response.body.data.title).toBe('Intro to JavaScript');
    });

    it('should return an error if title already exists', async () => {
        await request(app).post('/api/courses').send({
            title: 'Intro to JavaScript',
            description: 'Duplicate course test.',
            instructor: '60a77b2ff68f5e00156b3b4d',
        });

        const response = await request(app)
            .post('/api/courses')
            .send({
                title: 'Intro to JavaScript',
                description: 'This title already exists.',
                instructor: '60a77b2ff68f5e00156b3b4d',
            })
            .expect(400);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('A Course with this title already exists');
    });
});
