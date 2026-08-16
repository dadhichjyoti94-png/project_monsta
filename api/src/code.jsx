const orderModel = require("../../models/order")
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
require('dotenv').config()


var instance = new Razorpay({
    key_id: process.env.razorpay_key_id,
    key_secret: process.env.razorpay_key_secret,
});

console.log("KEY ID =>", process.env.razorpay_key_id);
console.log("KEY SECRET =>", process.env.razorpay_key_secret);

exports.orderPlace = async (request, response) => {

    try {

        // Extract and verfiy token
        var authHeader = request.headers.authorization;

        if (!authHeader) {
            return response.send({
                _status: false,
                _message: 'Authorization token is required  !!',
                deleted_at: null
            })
        }

        var token = authHeader.split(' ');

        if (!token[1]) {
            return response.send({
                _status: false,
                _message: 'Invaild token !!',
                deleted_at: null
            })
        }

        var verifyToken = await jwt.verify(token[1], process.env.secret_key);

        var totalOrders = await orderModel.find().countDocuments();

        var saveData = request.body;

        saveData.user_id = verifyToken.userData._id;

        saveData.order_number = 'MONSTA00' + (totalOrders + 1);


        // console.log("REQUEST BODY =>", request.body);
        // console.log("NET AMOUNT =>", request.body.net_amount);
        // console.log("AMOUNT SENT TO RAZORPAY =>", request.body.net_amount * 100);

        console.log(instance)

        var createOrder = await instance.orders.create({

            "amount": request.body.net_amount * 100,
            "currency": "INR",
            "receipt": saveData.order_number,
            "partial_payment": false,
        })

        saveData.order_id = createOrder.id;

        orderModel(saveData).save()
            .then(async (result) => {

                const data = {
                    _status: true,
                    _message: 'Order Placed succesfully !!',
                    _data: result,
                }

                response.send(data);
            })
            .catch((error) => {

                var errorMessage = {};
                console.log(error);

                for (key in error.errors) {
                    errorMessage[key] = error.errors[key].message

                    // console.log(key);
                }

                const data = {
                    _status: false,
                    _message: 'Something Went Wrong.',
                    _data: null,
                    _error: errorMessage
                }
                response.send(data);
            })
    } catch (error) {
        console.log(error);

        if (error.name === 'JsonWebTokenError') {
            return response.send({
                _status: false,
                _message: ' Invaild Token',
                _data: null
            });
        }

        if (error.name === 'TokenExpiredError') {
            return response.send({
                _status: false,
                _message: 'Token Expired',
                _data: null
            })
        }

        if (error.name === 'ValidationError') {
            var errorMessage = {};
            console.log(error);

            for (key in error.errors) {
                errorMessage[key] = error.errors[key].message

                // console.log(key);
            }

            return response.send({
                _status: false,
                _message: 'Validation Error.',
                _data: null,
                _error: error.message
            });
        }

        var data = {
            _status: false,
            _message: 'Something went wrong',
            _data: null,
            _error: error.message
        };

        response.send(data);
    }
}

exports.orderStatus = async (request, response) => {

    try {
        // Extract and verfiy token
        var authHeader = request.headers.authorization;

        if (!authHeader) {
            return response.send({
                _status: false,
                _message: 'Authorization token is required  !!',
                deleted_at: null
            })
        }

        var token = authHeader.split(' ');

        if (!token[1]) {
            return response.send({
                _status: false,
                _message: 'Invaild token !!',
                deleted_at: null
            })
        }

        var verifyToken = await jwt.verify(token[1], process.env.secret_key);

        var checkPayment = await instance.payments.fetch(request.body.payment_id);

        if (checkPayment.order_id != request.body.order_id) {
            return response.send({
                _status: false,
                _message: 'Invaild Order Id !!',
                deleted_at: null
            })
        }

        if (checkPayment.status == 'authorized') {
            await instance.payments.capture(checkPayment.id, checkPayment.amount, checkPayment.currency)
        }

        if (checkPayment.status == 'failed') {
            var orderStatus = 7;
            var paymentStatus = 3;
        } else {
            var orderStatus = 2;
            var paymentStatus = 2;
        }


        //  update order status
        var updateOrder = await orderModel.updateOne({
            order_id: request.body.order_id,
        }, {
            set: {
                payment_id: request.body.payment_id,
                order_status: orderStatus,
                payment_status: paymentStatus,
            }
        });

        if (paymentStatus == 2) {
            return response.send({
                _status: true,
                _message: 'Order Placed successfully',
                _payment_status: 1
            });
        } else {
            return response.send({
                _status: true,
                _message: 'Order Placed successfully',
                _payment_status: 0   
            });
        }
    }
    catch (error) {
        console.error('update profile error:', error)

        if (error.name === 'JsonWebTokenError') {
            return response.send({
                _status: false,
                _message: ' Invaild Token',
                _data: null
            });
        }

        if (error.name === 'TokenExpiredError') {
            return response.send({
                _status: false,
                _message: 'Token Expired',
                _data: null
            })
        }

        if (error.name === 'ValidationError') {
            var errorMessage = {};
            console.log(error);

            for (key in error.errors) {
                errorMessage[key] = error.errors[key].message

                // console.log(key);
            }

            return response.send({
                _status: false,
                _message: 'Validation Error.',
                _data: null,
                _error: error.message
            });
        }

        var data = {
            _status: false,
            _message: 'Something went wrong',
            _data: null,
            _error: error
        };

        response.send(data);
    }


}

exports.myOrders = async (request, response) => {

    // console.log(request.headers.authorization.split(' '))

    try {
        var token = request.headers.authorization.split(' ')

        var verifyToken = await jwt.verify(token[1], process.env.secret_key);

        userModel.findOne({
            _id: verifyToken.userData._id
        })
            .then((result) => {
                var data = {
                    _status: true,
                    _message: 'Profile Fetched Successfully',
                    _data: result
                }
                response.send(data);
            })
            .catch((error) => {
                var data = {
                    _status: false,
                    _message: 'Something went wrong !!',
                    _data: null,
                    _error: error
                }
                response.send(data);
            })

    } catch (error) {
        var data = {
            _status: false,
            _message: 'Something went wrong !!'
        }

        response.send(data);
    }
}








// razorpay_payment_id: "pay_T885Ai75mLSnbn"   successfull
// razorpay_order_id: "order_T884lVBZ6HycX4"


// payment_id: 'pay_T889rxxtzL3J4y', order_id: 'order_T889IWeVclfwS0'  fail