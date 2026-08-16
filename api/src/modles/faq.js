const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, "Question is required"]
    },

    answer: {
        type: String,
        required: [true, "Answer is required"]
    },

    order: {
        type: Number,
        default: 1
    },

    status: {
        type: Number,
        default: 1
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: null
    },

    deleted_at: {
        type: Date,
        default: null
    }

});

module.exports = mongoose.model("faq", faqSchema);