const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },

    designation: {
        type: String,
        required: [true, "Designation is required"]
    },

    message: {
        type: String,
        required: [true, "Message is required"]
    },

    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5
    },

    order: {
        type: Number,
        default: 1
    },

    image: {
        type: String,
        required: [true, "Image is required"]
    },

    status: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model("testimonial", testimonialSchema);
// const testimonialModel = require("../../models/testimonial");