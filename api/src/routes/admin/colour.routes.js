//express js ko bulana h

const express = require('express')
// const { create, view, details, update, changeStatus, destroy } = require('../../controller/admin/material.controller');
// const validate = require('../../middleware/admin/materialniddleware');
const { create, view, details, update, changeStatus, destroy } = require('../../controller/admin/colour.controller');
const adminAuth = require('../../middleware/admin/auth.middleware');



//express k pass router name ka function h

const route = express.Router();

// routes m validate ka use kaqrna h t

module.exports = server =>{

    //URL banayge 

    // route.post('/create', validate, create)  
    //     // Validate middleware pehle chalega

    route.post('/create', adminAuth, create)

    route.post('/view', view)
    // route.get('/view/:id')

    route.post('/details/:id', details)

    route.post('/update/:id', adminAuth, update)

    route.put('/change-status', adminAuth, changeStatus)

    route.post('/delete', adminAuth, destroy)

    //route name s function use lena h

    server.use('/api/admin/colour',route)
}
