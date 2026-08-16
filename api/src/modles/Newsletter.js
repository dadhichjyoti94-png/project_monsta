const mongoose = require("mongoose");


const newsletterSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true
    },


    status:{
        type:Number,
        default:1
    },


    deleted_at:{
        type:Date,
        default:null
    }


},{
    timestamps:true
});


module.exports = mongoose.model(
    "newsletter",
    newsletterSchema
);