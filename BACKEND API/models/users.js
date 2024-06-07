const Mongoose = require('mongoose');
let userSchema = new Mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: [3, 'Name must be at least 3 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters']
    }
}, { timestamps: true })

module.exports = Mongoose.model('User', userSchema);