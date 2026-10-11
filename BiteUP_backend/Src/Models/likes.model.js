const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foods',
        required: true
    }
}, {
    timestamps: true
})

const Like = mongoose.model('like', likeSchema);
module.exports = Like;