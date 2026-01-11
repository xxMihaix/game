
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    lastUsernameChange: {
        type: Date,
        default: null
    },
    profilePic: {
        type: Number,
        default: 0,
    },
    password: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        default: 10
    },
    role: {
        type: String,
        enum: ['admin', 'player'],
        default: 'player'
    }
})

module.exports = mongoose.model('User', userSchema);