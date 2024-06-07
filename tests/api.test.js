// app.test.js
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

// Function to generate unique task data
const generateUniqueTask = () => ({
	title: `Task 1`,
	description: `Description for Task 1`,
	due_date: '2024-04-20',
});

// Clear the database each time before each test suite is ran
beforeEach(async () => {
	const collections = Object.keys(mongoose.connection.collections);
	for (const collectionName of collections) {
		const collection = mongoose.connection.collections[collectionName];
		await collection.deleteMany({});
	}
});

// Close the Mongoose connection after all tests are done
afterAll(async () => {
	await mongoose.connection.close();
});

// Test to create task
describe('POST /tasks', () => {
	test('It should create a new task', async () => {
		const newTask = generateUniqueTask();
		const response = await request(app).post('/tasks').send(newTask);
		expect(response.statusCode).toBe(201);
		expect(response.body.responseMessage).toHaveProperty('_id');
		expect(response.body.responseMessage.title).toBe(newTask.title);
		expect(response.body.responseMessage.description).toBe(newTask.description);
		expect(response.body.responseMessage.status).toBe('pending');
		expect(response.body.responseMessage.due_date).toBe(newTask.due_date);
	});
});

// Test to get all tasks
describe('GET /tasks', () => {
	test('It should fetch all tasks', async () => {
		const response = await request(app).get('/tasks');
		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body.responseMessage)).toBe(true);
	});
});

// Test for task with ID and test if the ID is not correct
describe('GET /tasks/:id', () => {
	test('It should return a task with a specific ID', async () => {
		// Create a task to get its ID
		const newTask = generateUniqueTask();
		const createResponse = await request(app).post('/tasks').send(newTask);
		const taskId = createResponse.body.responseMessage._id;

		const response = await request(app).get(`/tasks/${taskId}`);
		expect(response.statusCode).toBe(200);
		expect(response.body.responseMessage).toHaveProperty('_id', taskId);
	});

	test('It should return 404 if task with specified ID does not exist', async () => {
		const response = await request(app).get('/tasks/6662dec5eb2e508cfcbb2fcf');
		expect(response.statusCode).toBe(404);
	});
});

// Test for update
describe('PUT /tasks/:id', () => {
	test('It should update a task with a specific ID', async () => {
		// Create a task to update
		const newTask = generateUniqueTask();
		const createResponse = await request(app).post('/tasks').send(newTask);
		const taskId = createResponse.body.responseMessage._id;

		const updatedTask = { title: 'Updated Task 1' };
		const response = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
		expect(response.statusCode).toBe(200);
		expect(response.body.responseMessage.title).toBe(updatedTask.title);
	});

	test('It should return 404 if task with specified ID does not exist', async () => {
		const updatedTask = { title: 'Updated Task 1' };
		const response = await request(app).put('/tasks/666220d1fb063ce9171bee4d').send(updatedTask);
		expect(response.statusCode).toBe(404);
	});
});

// Test for delete
describe('DELETE /tasks/:id', () => {
	test('It should delete a task with a specific ID', async () => {
		// Create a task to delete
		const newTask = generateUniqueTask();
		const createResponse = await request(app).post('/tasks').send(newTask);
		const taskId = createResponse.body.responseMessage._id;

		const response = await request(app).delete(`/tasks/${taskId}`);
		expect(response.statusCode).toBe(204);
	});

	test('It should return 404 if task with specified ID does not exist', async () => {
		const response = await request(app).delete('/tasks/666220d1fb063ce9171bee4d');
		expect(response.statusCode).toBe(404);
	});
});