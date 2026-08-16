const mongoose = require("mongoose");

const schema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Country name is required"],
        validate: {
            validator: async function (v) {
                const country = await this.constructor.findOne({
                    name: v,
                    deleted_at: null
                });
                return !country;
            },
            message: "Country already exists"
        }
    },

    order: {
        type: Number,
        required: [true, "Order is required"],
        min: [0, "Minimum value is 0"],
        max: [1000, "Maximum value is 1000"]
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
        default: Date.now
    },

    deleted_at: {
        type: Date,
        default: null
    }

});

module.exports = mongoose.model("countries", schema);