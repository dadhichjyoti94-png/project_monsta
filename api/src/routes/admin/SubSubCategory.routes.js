//express js ko bulana h

const express = require('express');
// const { parentCategory,create, view, details, update, changeStatus, destroy } = require('../../controller/admin/SubSubCategory.controller');
const multer = require('multer')
const path = require('path');
const { subCategory, parentCategory, create, view, details, update, changeStatus, destroy } = require('../../controller/admin/SubSubCategory.controller');
const adminAuth = require('../../middleware/admin/auth.middleware');






//express k pass router name ka function h

const route = express.Router();

// routes m validate ka use kaqrna h to

// route.use(validate)    //route level middleware 

module.exports = server => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/category')
        },
        filename: function (req, file, cb) {
            const extension =path.extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix+extension)
        }
    })

    const upload = multer({ storage: storage })

    // const uploadMiddleware = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 8 }])
    route.post('/parent-category', upload.none(), parentCategory)
    route.post('/sub-category', upload.none(), subCategory)
    route.post('/create', adminAuth, upload.single('image'), create)
    



    route.post('/view', upload.single('image'), view)
    

    // route.get('/view/:id')

    route.post('/details/:id', upload.single('image'), details)

    route.post('/update/:id', adminAuth, upload.single('image'), update)

    route.put('/change-status', adminAuth, upload.none(), changeStatus)

    route.post('/delete', adminAuth, upload.none(), destroy)

    //route name s function use lena h

    server.use('/api/admin/sub-sub-category', route)
}
