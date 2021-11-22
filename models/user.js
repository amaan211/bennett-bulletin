const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    First_Name: {
        type: String,
        required: true
    },

    Last_Name: {
        type: String,
        required: true
    },

    Username: {
        type: String,
        required: true
    },

    Bennett_email_id: {
        type: String,
        required: true
    },

    Password: {
        type: String,
        required: true
    },

    Confirm_Paassword: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now 
    }
})


const user = mongoose.model('user', userschema);

module.exports = user;