// Dependencies and models
const orderModel = require('../../modles/order')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.secret_key || '1234567890'
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const Razorpay = require('razorpay');
const { request } = require('http')
const { response } = require('express')
require('dotenv').config();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.razorpay_key_id
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || process.env.razorpay_key_secret

var instance = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});


exports.placeOrder = async (request, response) => {
  try {
    var authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.send({
        _status: false,
        _message: "Authorization token is required",
        _data: null,
      });
    }

    var token = authHeader.split(" ");

    if (!token[1]) {
      return response.send({
        _status: false,
        _message: "Invalid token format",
        _data: null,
      });
    }

    var verifyToken = jwt.verify(token[1], process.env.secret_key);

    var totalOrders = await orderModel.find().countDocuments()

    var saveData = request.body;
    saveData.user_id = verifyToken.userData._id;

    saveData.order_number = 'MONSTA_00' + (totalOrders + 1);

    var createOrder = await instance.orders.create({
      amount: Number(request.body.net_amount) * 100,
      currency: "INR",
      receipt: saveData.order_number,
      partial_payment: false,
    })

    saveData.order_id = createOrder.id

    orderModel(saveData)
      .save()
      .then((result) => {
        response.send({
          _status: true,
          _message: "Order placed successfully",
          _data: result,
        });
      })
      .catch((error) => {
        if (error.name === "ValidationError") {
          var errorMessages = {};

          for (let key in error.errors) {
            errorMessages[key] = error.errors[key].message;
          }

          return response.send({
            _status: false,
            _message: "Validation Error",
            _data: null,
            _error: errorMessages,
          });
        }

        response.send({
          _status: false,
          _message: "Order not placed",
          _data: error.message,
        });
      });

  } catch (error) {
    const errorMessage = error?.error?.description || error?.description || error?.message || "Order could not be created";

    console.error("Place order failed:", errorMessage);

    if (error.name === "JsonWebTokenError") {
      return response.send({
        _status: false,
        _message: "Invalid token",
        _data: null,
      });
    }

    if (error.name === "TokenExpiredError") {
      return response.send({
        _status: false,
        _message: "Token Expired",
        _data: null,
      });
    }

    response.send({
      _status: false,
      _message: errorMessage,
      _data: errorMessage,
    });
  }
};



exports.orderDetails = async (req, res) => {
  try {

    const { order_id } = req.body;

    if (!order_id) {
      return res.send({
        _status: false,
        _message: "Order Id is required"
      });
    }

    const order = await orderModel.findOne({ order_id });

    if (!order) {
      return res.send({
        _status: false,
        _message: "Order not found"
      });
    }

    return res.send({
      _status: true,
      _message: "Order Details",
      _data: order
    });

  } catch (err) {
    return res.status(500).send({
      _status: false,
      _message: err.message
    });
  }
};

exports.myOrder = async (req, res) => {
  try {

    const auth = req.headers.authorization;

    if (!auth) {
      return res.send({
        _status: false,
        _message: "Authorization required"
      });
    }

    const token = auth.split(" ")[1];
    const verifyToken = jwt.verify(token, JWT_SECRET);

    const orders = await orderModel.find({
      user_id: verifyToken.userData._id
    });

    return res.send({
      _status: true,
      _message: "Orders fetched",
      _data: orders
    });

  } catch (err) {
    return res.send({
      _status: false,
      _message: err.message
    });
  }
};


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
            $set: {
                payment_id: request.body.payment_id,
                order_status: orderStatus,
                payment_status: paymentStatus,
                updated_at: new Date(),
            }
        });

        if (paymentStatus == 2) {
            return response.send({
                _status: true,
                _message: 'Order Placed successfully',
                _payment_status: 1,
                 _data: checkPayment
            });
        } else {
            return response.send({
                _status: true,
                _message: 'Order Placed successfully',
                _payment_status: 0 ,
                 _data: checkPayment  
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


// exports.orderStatus = async (req, res) => {
//   try {

//     const { payment_id, order_id } = req.body;

//     if (!payment_id || !order_id) {
//       return res.send({
//         _status: false,
//         _message: "Payment Id and Order Id are required"
//       });
//     }

//     // Razorpay payment verify
//     const checkPayment = await instance.payments.fetch(payment_id);

//     console.log(checkPayment);

//     // Order find
//     const order = await orderModel.findOne({ order_id });

//     console.log("ORDER FROM DB:", order);

//     if (!order) {
//       return res.send({
//         _status: false,
//         _message: "Order not found"
//       });
//     }

//     // Payment update
//     order.payment_id = payment_id;
//     order.payment_status = 2;
//     order.order_status = 2;
//     order.updated_at = new Date();

//     await order.save();

//     return res.send({
//   _status: true,
//   _message: "Payment Successful",
//   _data: {
//     order,
//     payment: checkPayment
//   }
// });
//   } catch (err) {
//     return res.status(500).send({
//       _status: false,
//       _message: err.message
//     });
//   }
// };
// exports.orderStatus = async (req, res) => {


//   try {
//     console.log("BODY:", req.body);

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.send({
//         _status: false,
//         _message: "Authorization token is required"
//       });
//     }

//     const token = authHeader.split(" ");

//     if (!token[1]) {
//       return res.send({
//         _status: false,
//         _message: "Invalid token"
//       });
//     }

//     const verifyToken = jwt.verify(token[1], JWT_SECRET);

//     console.log("TOKEN USER ID:", verifyToken.userData._id);

//     const { payment_id, order_id } = req.body;

//      console.log("ORDER ID:", order_id);

//     const checkPayment = await instance.payments.fetch(req.body.payment_id);

//     console.log("Order Id:", order_id);
//     console.log("User Id:", verifyToken.userData._id);

//     const order = await orderModel.findOne({
//       order_id,
//       user_id: verifyToken.userData._id

    
//     });
//     console.log("ORDER FROM DB:", order);
//         console.log("Order:", order);
//     if (!order) {
//       return res.send({
//         _status: false,
//         _message: "Order not found"
//       });
//     }
//     console.log("DB USER ID:", order.user_id);

//     order.payment_id = payment_id;
//     order.payment_status = 2;
//     order.order_status = 2;
//     order.updated_at = new Date();

//     await order.save();

//     return res.send({
//       _status: true,
//       _message: "Payment Successful",
//       _data: checkPayment
//     });

//   } catch (err) {
//     return res.status(500).send({
//       _status: false,
//       _message: err.message
//     });
//   }
// };


// razorpay_payment_id: 'pay_T7VSbQ0YW366Qu', razorpay_order_id: 'order_T7VRjGKRJjC7Jy'
// new order
// {razorpay_payment_id: 'pay_TIDMSer7O3id1F', razorpay_order_id: 'order_TIDLRSVlRnMZXk', razorpay_signature: '731756188daeb69654a1a0d66778752fbe9bcf405c1b162e6c90999cde4bcd97'}

//camcel payment

// payment_id: 'pay_T7VZk9xn9R3heM', order_id: 'order_T7VWReqc0OAWP3'
