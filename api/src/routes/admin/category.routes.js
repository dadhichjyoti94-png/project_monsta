const express = require('express');
const { create, view, details, update, changeStatus, destroy } = require('../../controller/admin/category.controller');
const multer = require('multer');
const path = require('path');
const adminAuth = require('../../middleware/admin/auth.middleware');

const route = express.Router();

module.exports = server => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/category')
        },
        filename: function (req, file, cb) {
            const extension = path.extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + extension)
        }
    });


    const upload = multer({ storage: storage });


    // Create Category
    route.post('/create', adminAuth, upload.single('image'), create);


    // View Category List
    route.post('/view', upload.none(), view);


    // Get Single Category Data For Edit
    route.post('/details/:id', details);


    // Update Category
    route.put('/update/:id', adminAuth, upload.single('image'), update);


    // Change Status
    route.put('/change-status', adminAuth, upload.none(), changeStatus);


    // Delete Category
    route.post('/delete', adminAuth, upload.none(), destroy);


    server.use('/api/admin/category', route);
}
