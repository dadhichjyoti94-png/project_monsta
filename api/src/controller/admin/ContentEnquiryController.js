// const contentEnquiryModel = require("../../models/contentEnquiry");
const contentEnquiryModel = require("../../modles/ContentEnquiry")




// Create Enquiry

exports.create = async(req,res)=>{
    console.log("BODY DATA:", req.body);


    let dataSave = req.body;


    contentEnquiryModel(dataSave)
    .save()

    .then((result)=>{


        res.send({

            _status:true,

            _message:"Enquiry Submitted Successfully",

            _data:result

        })


    })


    .catch((error)=>{


        let errorMessages={};


        for(let key in error.errors){

            errorMessages[key] = error.errors[key].message;

        }


        res.send({

            _status:false,

            _message:"Something went wrong",

            _error:errorMessages

        })


    })


}


// View

exports.view = async(req,res)=>{
    const limit = Number(req.body.limit) || 10;
    const page = Number(req.body.page) || 1;
    const skip = (page - 1) * limit;

    const filter = {
        deleted_at:null
    };

    const totalRecords = await contentEnquiryModel.countDocuments(filter);
    let result = await contentEnquiryModel.find(filter)
        .sort({_id:-1})
        .limit(limit)
        .skip(skip);


    res.send({

        _status:true,
        _message:"Record Found",
        _paginate:{
            total_records:totalRecords,
            current_page:page,
            total_pages:Math.ceil(totalRecords / limit) || 1
        },
        _data:result

    });

}



// Change Status

exports.changeStatus = async(req,res)=>{


    contentEnquiryModel.updateMany(

        {
            _id:req.body.ids
        },

        [
            {
                $set:{
                    status:{
                        $not:"$status"
                    }
                }
            }
        ]

    )
    .then((result)=>{

        res.send({

            _status:true,
            _message:"Status Changed Successfully",
            _data:result

        })

    })

}




// Delete

exports.destroy = async(req,res)=>{


    contentEnquiryModel.updateMany(

        {
            _id:req.body.id
        },

        {
            $set:{
                deleted_at:Date.now()
            }
        }

    )
    .then((result)=>{


        res.send({

            _status:true,
            _message:"Deleted Successfully",
            _data:result

        })


    })

}
