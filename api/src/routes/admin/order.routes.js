const express = require('express');
const multer = require('multer');
const { view, details, updateStatus, destroy } = require('../../controller/admin/order.controller');
const adminAuth = require('../../middleware/admin/auth.middleware');

const routes = express.Router();
const upload = multer();

module.exports = (server) => {
    routes.post('/view', adminAuth, upload.none(), view);
    routes.get('/details/:id', adminAuth, details);
    routes.put('/update-status/:id', adminAuth, upload.none(), updateStatus);
    routes.put('/delete', adminAuth, upload.none(), destroy);

    server.use('/api/admin/order', routes);
};
