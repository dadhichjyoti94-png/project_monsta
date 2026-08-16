const express = require("express");
const multer = require("multer");
const adminAuth = require("../../middleware/admin/auth.middleware");

const upload = multer();

const {
    create,
    view,
    details,
    update,
    changeStatus,
    destroy
} = require("../../controller/admin/country.controller");

const route = express.Router();

module.exports = (server) => {

    route.post("/create", adminAuth, upload.none(), create);

    route.post("/view", upload.none(), view);

    route.post("/details/:id", upload.none(), details);

    route.put("/update/:id", adminAuth, upload.none(), update);

    route.put("/change-status", adminAuth, upload.none(), changeStatus);

    route.post("/delete", adminAuth, upload.none(), destroy);

    server.use("/api/admin/country", route);

};
