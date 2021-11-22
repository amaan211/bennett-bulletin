const mongoose = require('mongoose');

const postsschema = new mongoose.Schema({
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


const posts = mongoose.model('posts', postsschema);

module.exports = posts;