const express = require("express");
const multer = require("multer");
const path = require("path");
const adminAuth = require("../../middleware/admin/auth.middleware");

const {
    create,
    view,
    details,
    update,
    changeStatus,
    destroy
} = require("../../controller/admin/testimonial.controller");

const router = express.Router();

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/testimonial");
    },

    filename: function (req, file, cb) {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});

const upload = multer({
    storage
});

module.exports = server => {

    router.post("/create", adminAuth, upload.single("image"), create);

    router.post("/view", view);

    router.get("/details/:id", details);

    router.put("/update/:id", adminAuth, upload.single("image"), update);

    router.put("/change-status", adminAuth, changeStatus);

    router.delete("/delete", adminAuth, destroy);

    server.use("/api/admin/testimonial", router);

}
