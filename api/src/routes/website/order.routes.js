
const express = require('express');
const { placeOrder, orderStatus, myOrder, orderDetails} = require('../../controller/website/order.controller');
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: 'uploads' })



const route = express.Router();


module.exports = server => {

    route.post('/place-order', upload.none(), placeOrder)

    route.post('/order-status', upload.none(), orderStatus)

    route.post('/my-order', upload.none(), myOrder)

    route.post('/order-details', upload.none(), orderDetails)


    //route name s function use lena h

    server.use('/api/website/checkout', route)
}
