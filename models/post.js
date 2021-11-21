const mongoose = require('mongoose');

const postschema = new mongoose.Schema({
    Author: {
        type: String,
        required: true
    },

    Title: {
        type: String,
        required: true
    },

    Content: {
        type: String,
        required: true
    },

    PostedAt: {
        type: Date,
        default: Date.now
    }
})


const post = mongoose.model('post', postschema);

module.exports = post;