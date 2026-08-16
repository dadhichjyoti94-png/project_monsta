const express=require("express");
const adminAuth = require("../../middleware/admin/auth.middleware");


const {
    create,
    view,
    changeStatus,
    destroy

}=require("../../controller/admin/newsletter.controller");


const router=express.Router();



module.exports=server=>{

    router.post("/create", create);

    


    router.post("/view", adminAuth, view);


    router.put(
        "/change-status",
        adminAuth,
        changeStatus
    );


    router.delete(
        "/delete",
        adminAuth,
        destroy
    );



    server.use(
        "/api/admin/newsletter",
        router
    );


}
