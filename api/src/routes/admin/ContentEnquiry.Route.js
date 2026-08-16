const express = require("express");
const adminAuth = require("../../middleware/admin/auth.middleware");

const {
    create,
    view,
    changeStatus,
    destroy
}=require("../../controller/admin/ContentEnquiryController");

const router = express.Router();


module.exports = server => {


    // Create Enquiry
    router.post(
        "/create",
        create
    );


    // View Enquiry
    router.post(
        "/view",
        adminAuth,
        view
    );


    // Change Status
    router.put(
        "/change-status",
        adminAuth,
        changeStatus
    );


    // Delete
    router.delete(
        "/delete",
        adminAuth,
        destroy
    );


    server.use(
        "/api/admin/content-enquiry",
        router
    );

}
