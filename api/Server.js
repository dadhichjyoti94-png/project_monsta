// Always load this API project's environment file, even when the server is
// started from another working directory.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');   //mongoose ko connect kiya ,schema bana na
const { ServerSession } = require('mongodb');


//Executable function

//server banaya

const server = express();

//middle ware start

//json formate m aane wale data ko read karna

server.use(bodyParser.json());   



const allowedOrigins = [
    process.env.frontend_url,
    process.env.FRONTEND_URL,
    process.env.admin_frontend_url,
    process.env.ADMIN_FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:5173',
]
    .filter(Boolean)
    .flatMap(origin => origin.split(','))
    .map(origin => origin.trim())
    .filter(Boolean);

server.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}))



//post method k liye USE JSON AND URLENCODED data ko recive karne k liye

server.use(express.json());

// recive form data

server.use(express.urlencoded(({extended : true})))

//ROUTEING START HOMEPAGE

server.get('/', (request,response) =>{
    response.send('server is working fine.')

})

server.use('/uploads',express.static('uploads'));
//WEBSITE ROUTES
require('./src/routes/website/user.routes')(server)
require('./src/routes/website/order.routes')(server)
require('./src/routes/website/contentEnquiry.routes')(server)
require('./src/routes/website/newsletter.routes')(server)
require('./src/routes/website/company.routes')(server)

//Admin ROUTES

require("./src/routes/admin/auth.routes")(server)
require('./src/routes/admin/material.routes')(server)
require('./src/routes/admin/colour.routes')(server)
require('./src/routes/admin/category.routes')(server)
require('./src/routes/admin/SubCategory.routes')(server)
require('./src/routes/admin/SubSubCategory.routes')(server)
require('./src/routes/admin/product.routes')(server)
require('./src/routes/admin/whyChooseRouter')(server)
require("./src/routes/admin/testimonial.route")(server);
require("./src/routes/admin/ContentEnquiry.Route")(server);
require("./src/routes/admin/Newslette.Route")(server)
require("./src/routes/admin/country")(server)
require("./src/routes/admin/slider.routes")(server)
require("./src/routes/admin/faq.routes")(server)
require("./src/routes/admin/order.routes")(server)
require("./src/routes/admin/user.routes")(server)

//APLICATION ROUTES



// "mongodb://dadhichjyoti94_db_user:aWuW05Z7B3hY7bcf@ac-mfifj6w-shard-00-00.mlcdxug.mongodb.net:27017,ac-mfifj6w-shard-00-01.mlcdxug.mongodb.net:27017,ac-mfifj6w-shard-00-02.mlcdxug.mongodb.net:27017/?ssl=true&replicaSet=atlas-lb4y05-shard-0&authSource=admin&appName=Cluster0"


// 'mongodb+srv://dadhichjyoti94_db_user:aWuW05Z7B3hY7bcf@cluster0.mlcdxug.mongodb.net/atlas_project?appName=Cluster0'

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://dadhichjyoti94_db_user:aWuW05Z7B3hY7bcf@ac-mfifj6w-shard-00-00.mlcdxug.mongodb.net:27017,ac-mfifj6w-shard-00-01.mlcdxug.mongodb.net:27017,ac-mfifj6w-shard-00-02.mlcdxug.mongodb.net:27017/?ssl=true&replicaSet=atlas-lb4y05-shard-0&authSource=admin&appName=Cluster0";

const startServer = async () => {
    try {
        // MongoDB connect hone ke baad hi server start karo, warna admin APIs hang hoti hain.
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
        console.log('Connected!');
        console.log("Database Name:", mongoose.connection.db.databaseName);

        server.listen(PORT, () => {
            console.log(`server is working fine on port ${PORT}.`);
        });
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

startServer();
