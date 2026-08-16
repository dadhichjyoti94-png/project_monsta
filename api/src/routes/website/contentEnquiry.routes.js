const express = require("express");
const { create } = require("../../controller/admin/ContentEnquiryController");
const multer = require("multer");

const route = express.Router();
const upload = multer();

module.exports = server => {
    route.post("/create", upload.none(), create);

    server.use("/api/website/content-enquiry", route);
};
