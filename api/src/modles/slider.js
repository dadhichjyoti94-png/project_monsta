const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required"]
    },

    image: {
        type: String,
        required: [true, "Image is required"]
    },

    order: {
        type: Number,
        required: [true, "Order is required"]
    },

    status: {
        type: Boolean,
        default: true
    },

    deleted_at: {
        type: Date,
        default: null
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: null
    }

});

module.exports = mongoose.model("slider", sliderSchema);