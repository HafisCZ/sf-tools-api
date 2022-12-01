import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    multiple: {
        type: Boolean,
        required: false,
        default: false
    },
    key: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Entry', entrySchema);