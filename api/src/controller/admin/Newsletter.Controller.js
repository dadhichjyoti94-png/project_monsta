const newsletterModel = require("../../modles/Newsletter");

// Create Newsletter

exports.create = async(req,res)=>{

    try{
        console.log("Newsletter Data:", req.body);

        let dataSave = req.body;

    


        let result = await newsletterModel(dataSave).save();


        res.send({

            _status:true,

            _message:"Newsletter Added Successfully",

            _data:result

        });


    }
    catch(error){


        let errorMessages={};


        for(let key in error.errors){

            errorMessages[key] = error.errors[key].message;

        }


        res.send({

            _status:false,

            _message:"Something went wrong",

            _error:errorMessages

        });


    }

}



// View

exports.view = async(req,res)=>{
    const limit = Number(req.body.limit) || 10;
    const page = Number(req.body.page) || 1;
    const skip = (page - 1) * limit;

    const filter = {
        deleted_at:null
    };

    const totalRecords = await newsletterModel.countDocuments(filter);
    let result = await newsletterModel.find(filter)
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


    newsletterModel.updateMany(

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


    newsletterModel.updateMany(

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
