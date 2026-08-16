
const express = require('express');
const { register, login, viewProfile, updateProfile, changePassword, forgotPassword,resetPassword } = require('../../controller/website/user.controller');
const multer = require('multer')
const path = require('path')


const route = express.Router();


module.exports = server => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/users')
        },
        filename: function (req, file, cb) {
            const extension =path.extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix+extension)
        }
    })

    const upload = multer({ storage: storage })

    // const uploadMiddleware = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 8 }])

    route.post('/register', upload.single('image'), register)



    route.post('/login', upload.none(), login)

    // route.get('/view/:id')

    route.post('/view-profile', upload.none(), viewProfile)

    route.put('/update-profile', upload.single('image'), updateProfile)

    route.put('/change-password', upload.none(), changePassword)

    route.post('/forgot-password', upload.none(), forgotPassword)

    route.put('/reset-password', upload.none(), resetPassword)

    //route name s function use lena h

    server.use('/api/website/user', route)
}
