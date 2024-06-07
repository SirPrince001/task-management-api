const Mongoose = require('mongoose');
const Task = require('../models/task');
const { ValidationError, NotFoundError } = require('../../helper/error')

// create new task
exports.createTask = async (request, response, next) => {
	try {
		// check if task exists
		const task = await Task.findOne({ title: request.body.title });
		if (task) {
			throw new ValidationError(`task already exists with title ${task.title}`);
		}
		// create new task
		let { title, description, due_date } = request.body;

		if (!title) {
			throw new ValidationError('title is required');
		}

		if (!description) {
			throw new ValidationError('description is required');
		}

		if (!due_date) {
			throw new ValidationError('due_date is required');
		}

		const newTask = new Task({
			title,
			description,
			due_date,
		});
		// save new task
		const savedTask = await newTask.save();
		return response.status(201).json({ success: true, responseMessage: savedTask });
	} catch (error) {
		next(error);
	}
};

// get all tasks
exports.getAllTasks = async (request, response, next) => {
	try {
		const tasks = await Task.find({});
		return response.status(200).json({ success: true, responseMessage: tasks });
	} catch (error) {
		next(error);
	}
};

// get task by id
exports.getTaskById = async (request, response, next) => {
	try {
		// check if id is valid
		let task_id = request.params.id;
		if (!Mongoose.isValidObjectId(task_id)) {
			throw new ValidationError(`invalid id ${task_id}`);
		}

		const task = await Task.findById(task_id);
		if (!task) {
			throw new NotFoundError(`task with id ${task_id} not found`);
		}
		return response.status(200).json({ success: true, responseMessage: task });
	} catch (error) {
		next(error);
	}
};

//update task
exports.updateTask = async (request, response, next) => {
	try {
		// check if id is valid
		let task_id = request.params.id;
		if (!Mongoose.isValidObjectId(task_id)) {
			throw new ValidationError(`invalid id ${task_id}`);
		}
		// check if task exists
		const task = await Task.findById(task_id);
		if (!task) {
			throw new NotFoundError(`task not found with id ${task_id}`);
		}
		// update task
		const updatedTask = await Task.findByIdAndUpdate(task_id, request.body, { new: true });
		return response.status(200).json({ success: true, responseMessage: updatedTask });
	} catch (error) {
		next(error);
	}
};

//delete a task
exports.deleteTask = async (request, response, next) => {
	try {
		// check if id is valid
		let task_id = request.params.id;
		if (!Mongoose.isValidObjectId(task_id)) {
			throw new ValidationError(`invalid id ${task_id}`);
		}
		// check if task exists
		const task = await Task.findById(task_id);
		if (!task) {
			throw new NotFoundError(`task not found with id ${task_id}`);
		}
		// delete task
		const deletedTask = await Task.findByIdAndDelete(task_id);
		return response.status(204).json({ success: true, responseMessage: deletedTask });
	} catch (error) {
		next(error);
	}
};

//sort and get task with the current due date
exports.getNextThreeDueTasks = async (request, response, next) => {
	try {
		const tasks = await Task.find({}).sort({ due_date: 1 }).limit(3);
		return response.status(200).json({ success: true, responseMessage: tasks });
	} catch (error) {
		next(error);
	}
};