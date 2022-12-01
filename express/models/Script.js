import mongoose from 'mongoose';

const scriptSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    secret: {
        type: String,
        required: true
    },
    private: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Script', scriptSchema);