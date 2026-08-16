const express = require("express");
const multer = require("multer");
const adminAuth = require("../../middleware/admin/auth.middleware");

const {
  create,
  view,
  details,
  update,
  destroy,
  changeStatus
} = require("../../controller/admin/faq.controller");

const route = express.Router();

const upload = multer();

module.exports = (server) => {

  route.post("/create", adminAuth, upload.none(), create);

  route.post("/view", view);
  route.get("/details/:id", details);
  route.put("/update/:id", adminAuth, update);
  route.put("/change-status", adminAuth, changeStatus);
  route.post("/delete", adminAuth, destroy);

  server.use("/api/admin/faq", route);
};
