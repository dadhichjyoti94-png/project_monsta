const express = require('express');
const multer = require('multer');
const { login, profile, logout } = require('../../controller/admin/auth.controller');
const { getCompany, updateCompany } = require('../../controller/admin/company.controller');
const adminAuth = require('../../middleware/admin/auth.middleware');

const route = express.Router();
const upload = multer();

module.exports = server => {
    route.post('/login', upload.none(), login);
    route.get('/profile', adminAuth, profile);
    route.post('/profile', adminAuth, profile);
    route.put('/profile', adminAuth, profile);
    route.get('/company', adminAuth, getCompany);
    route.put('/company', adminAuth, updateCompany);
    route.post('/logout', adminAuth, logout);

    server.use('/api/admin/auth', route);
    server.use('/api/admin/login', upload.none(), login);
    server.use('/api/admin/profile', adminAuth, profile);
    server.use('/api/admin/logout', adminAuth, logout);
};
