const router = require('express').Router();
const taskRouter = require('../controllers/taskController');
const userAuth = require('../middlewares/auth.user');
/**
 * @swagger
 * components:
 *    schemas:
 * 
 *      
 */
router.post('/tasks', userAuth, taskRouter.createTask);
router.get('/tasks', taskRouter.getAllTasks);
router.get('/tasks/:id', taskRouter.getTaskById);
router.put('/tasks/:id', userAuth, taskRouter.updateTask);
router.delete('/tasks/:id', userAuth, taskRouter.deleteTask);
router.get('/tasks/next-three', taskRouter.getNextThreeDueTasks);

module.exports = router;