const mongoose = require("mongoose");


const contentEnquirySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    subject:{
        type:String,
        default:""
    },

    message:{
        type:String,
        default:""
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
    "contentEnquiry",
    contentEnquirySchema
);