

const express = require('express');
const multer = require('multer')
multer({ dest: 'uploads/products' })
const path = require('path');
const adminAuth = require('../../middleware/admin/auth.middleware');
// const{parentCategory,subCategory,SubSubCategory,colours,materials,view,details,update,changeStatus,destroy}=require("../../controller/admin/Product.controller");
const {
    parentCategory, subCategory, SubSubCategory, colours, materials, view, details, update, changeStatus, destroy,
    create } = require('../../controller/admin/Product.controller');



const route = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/products')
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    }
})

const upload = multer({ storage: storage })

const uploadMiddleware = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 8 }])



module.exports = server => {



    route.post('/parent-category', upload.none(), parentCategory)
   route.post('/sub-category', upload.none(), subCategory)
    route.post('/sub-sub-category', upload.none(), SubSubCategory)
     route.post('/colour', upload.none(),colours )

    //  categoryModel.find(filter)
    
    route.post('/material', upload.none(), materials)
    console.log("Product create function:", create)
     route.post('/create', adminAuth, uploadMiddleware, create)
     route.post('/view', upload.none(), view)
     route.post('/details/:id', upload.single('image'), details)

     route.post('/update/:id', adminAuth, uploadMiddleware, update)

     route.put('/change-status', adminAuth, upload.none(), changeStatus)

     route.post('/delete', adminAuth, upload.none(), destroy)

    //route name s function use lena h

    server.use('/api/admin/product', route)
}
