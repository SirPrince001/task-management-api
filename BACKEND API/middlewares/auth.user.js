require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = async (request, response, next) => {
	try {
		let token = request.headers.authorization;

		if (!token) {
			return response.status(401).json({ success: false, responseMessage: 'Login to continue' });
		}

		token = token.split(' ')[1];
		let user = jwt.verify(token, process.env.JWT_SECRET);

		if (!user) {
			return response
				.status(401)
				.json({ success: false, responseMessage: `Session expired, login to continue` });
		}

		next(user);
	} catch (error) {
		next(error);
	}
};

module.exports = authMiddleware;