const express = require("express");
const route = express.Router();

const multer = require("multer");
const path = require("path");
const adminAuth = require("../../middleware/admin/auth.middleware");

const {
    create,
    update,
    view,
    details,
    changeStatus,
    destroy
} = require("../../controller/admin/slider.controller");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/slider");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

module.exports = (server) => {

    route.post("/create", adminAuth, upload.single("image"), create);
    route.put("/update/:id", adminAuth, upload.single("image"), update);
    route.post("/view", upload.single("image"), view);
    route.post("/details/:id", upload.none(), details);
    route.put("/change-status", adminAuth, upload.none(), changeStatus);
    route.post("/delete", adminAuth, upload.none(), destroy);

    server.use("/api/admin/slider", route);
};
