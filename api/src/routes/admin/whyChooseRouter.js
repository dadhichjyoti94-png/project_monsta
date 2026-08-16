const express = require("express");
const multer = require("multer");
const path = require("path");
const adminAuth = require("../../middleware/admin/auth.middleware");

const {
  whyChooseCreate,
  whyChooseView,
  whyChooseDelete,
  whyChooseUpdate,
  whyChooseViewOne,
  whyChooseChangeStatus,
} = require("../../controller/admin/whyChooseController");

const route = express.Router();

module.exports = (server) => {

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/whychooseus");
    },
    filename: function (req, file, cb) {
      const extension = path.extname(file.originalname);
      const uniqueSuffix =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(null, file.fieldname + "-" + uniqueSuffix + extension);
    },
  });

  const upload = multer({ storage: storage });

  // Create
  route.post("/create", adminAuth, upload.single("image"), whyChooseCreate);

  // View All
  route.get("/view", whyChooseView);

  // Single View
  route.get("/view/:id", whyChooseViewOne);

  // Update
  route.put("/update/:id", adminAuth, upload.single("image"), whyChooseUpdate);

  // Change Status
  route.put("/change-status", adminAuth, upload.none(), whyChooseChangeStatus);

  // Delete
  route.post("/delete", adminAuth, upload.none(), whyChooseDelete);

  server.use("/api/admin/why-choose-us", route);
};
