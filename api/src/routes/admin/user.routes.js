const express = require('express');
const { view, details, update, changeStatus, destroy } = require('../../controller/admin/user.controller');
const adminAuth = require('../../middleware/admin/auth.middleware');

const routes = express.Router();

module.exports = server => {
    routes.post('/view', adminAuth, view);
    routes.post('/details/:id', adminAuth, details);
    routes.put('/update/:id', adminAuth, update);
    routes.put('/change-status', adminAuth, changeStatus);
    routes.put('/delete', adminAuth, destroy);

    server.use('/api/admin/user', routes);
};
