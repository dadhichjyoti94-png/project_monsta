const express = require('express');
const { getPublicCompany } = require('../../controller/admin/company.controller');

const route = express.Router();

module.exports = (server) => {
    route.get('/', getPublicCompany);
    server.use('/api/website/company', route);
};
