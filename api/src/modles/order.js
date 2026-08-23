const mongoose = require("mongoose");


const schema = new mongoose.Schema({

    user_id:{
        type:String,
        required:[true,"User Id is required"]
    },


    name:{
        type:String,
        required:[true,"Name is required"],
        match:[/^[a-zA-Z0-9 -]{2,30}$/,"Name is invalid"]
    },


    mobile_number:{
        type:Number,
        required:[true,"Mobile Number is required"]
    },


    order_number:{
        type:String,
        required:[true,"Order Number is required"]
    },


    order_id:{
        type:String,
        default:""
    },


    payment_id:{
        type:String,
        default:""
    },

    email_delivery_status:{
        type:String,
        enum:['pending', 'sending', 'sent', 'failed'],
        default:'pending'
    },

    order_confirmation_email_sent_at:{
        type:Date,
        default:null
    },


    order_note:{
        type:String,
        default:""
    },


    billing_address:{
        type:mongoose.Schema.Types.Mixed,
        required:[true,"Billing Address is required"]
    },


    shipping_address:{
        type:mongoose.Schema.Types.Mixed,
        required:[true,"Shipping Address is required"]
    },


    product_info:{
        type:Array,
        required:[true,"Product Info is required"]
    },


    total_amount:{
        type:Number,
        required:[true,"Total Amount is required"]
    },


    discount_amount:{
        type:Number,
        required:[true,"Discount Amount is required"]
    },


    net_amount:{
        type:Number,
        required:[true,"Net Amount is required"]
    },


    payment_status:{
        type:Number,
        default:1
        // 1 pending
        // 2 success
        // 3 failed
    },


    order_status:{
        type:Number,
        default:1
        // 1 placed
        // 2 received
        // 3 shipped
        // 4 out delivery
        // 5 completed
        // 6 cancelled
        // 7 failed
    },


    created_at:{
        type:Date,
        default:Date.now
    },


    updated_at:{
        type:Date,
        default:Date.now
    },


    deleted_at:{
        type:Date,
        default:null
    }


});


const orderModel = mongoose.model("orders",schema);


module.exports = orderModel;
