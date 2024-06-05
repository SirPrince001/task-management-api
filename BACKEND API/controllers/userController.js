const Mongoose = require('mongoose');
const User = require('../models/users');
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// create new user
exports.createUser = async (request, response) => {
    //check if user already exists in the database by email
    let userEmail = await User.findOne({ email: request.body.email });

    if (userEmail) {
        return response.status(400).json({ success: false, message: `User already exists in the database with this email ${userEmail.email}` });
    }

    //create a new user if the email does not exist
    try {
        let { name, email, password } = request.body;
        password = Bcrypt.hashSync(request.body.password, 10)
        let newUser = new User({name, email, password});
        let savedUser = await newUser.save();
        savedUser = savedUser.toJSON();
        delete savedUser.password;
        //create user payload
        const userPayLoad = {
            name: savedUser.name,
            email: savedUser.email
        }
        // create  user token
        const userToken = jwt.sign(userPayLoad, process.env.JWT_SECRET, { expiresIn: 86400 });
        // return user token
        return response.status(200).json({ success: true, message: `User  saved successfully`, user: savedUser, token: userToken })
    } catch (error) {
        return response.status(500).json({ success: false, message: `Unable to save user ${savedUser.name}`, error });
    }


}

exports.editUser = async (request, response) => {
    try {
        // get user id
        let user_id = request.params.id;
        if (!Mongoose.isValidObjectId(user_id)) return response.status(422).json({ success: false, message: `No User with id ${user_id}` });

        // find user with given id
        let updatedUser = await User.findByIdAndUpdate(user_id, request.body, { new: true });
        return response.status(200).json({ success: true, message: updatedUser });

    } catch (error) {
        return response.status(500).json({ success: false, message: `Unable to update user with id ${user_id}` }, error);
    }

}


exports.getSingleUser = async (request, response) => {
    try {
        // Get a single user by id
        let userId = request.params.id;
        //check if the user id exists
        if (!Mongoose.isValidObjectId(userId)) return response.status(422).json({ success: false, message: `No User with id ${userId}` });
        let singleUser = await User.findById(userId).select('-password');
        return response.status(200).json({ success: true, message: singleUser });

    } catch (error) {
        return response.status(422).json({ success: false, message: ` Unable to get user with id ` });
    }
}

exports.getAllUsers = async (request, response) => {
    try {
        let users = await User.find().select('-password');
        return response.status(200).json({ success: true, message: users });

    } catch (error) {
        return response.status(422).json({ success: false, message: `Unable to get users` });
    }
}

//login user
exports.login = async (request, response) =>{
    // validate inputs
    const { email, password } = request.body;
    if (!email ||!password) {
        return response.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // find user by email
    let user = await User.findOne({ email: email }).select("-password");
    if (!user) {
        return response.status(400).json({ success: false, message: `No user found with email ${email}` });
    }

    // check if password matches
    const isMatch = Bcrypt.compareSync(request.body.password, user.password);
    if (!isMatch) {
        return response.status(400).json({ success: false, message: `Password does not match` });
    }

    
 
    // create  user payload
    const userPayLoad = {
        name: user.name,
        email: user.email
    }
    // create  user token
    const userToken = jwt.sign(userPayLoad, process.env.JWT_SECRET, { expiresIn: 86400 });
    // return user token
    return response.status(200).json({ success: true, message: `User ${user.name} logged in successfully`, user: user, token: userToken })

}

// delete user account
exports.deleteUser = async (request, response) => {
    try {
        // get user id
        let user_id = request.params.id;
        if (!Mongoose.isValidObjectId(user_id)) return response.status(422).json({ success: false, message: `No User with id ${user_id}` });

        // find user with given id
        let deletedUser = await User.findByIdAndDelete(user_id);
        return response.status(200).json({ success: true, message: deletedUser });

    } catch (error) {
        return response.status(500).json({ success: false, message: `Unable to delete user with id ${user_id}` }, error);
    }
}