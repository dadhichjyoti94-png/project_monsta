
// function bana rahe h or sath m export kar rahr h

const materialModel = require("../../modles/material");

exports.create = async (request, response) => {
    // datasave variale m keys ko save kara diya
    const dataSave = request.body;

    // insert ki query

    materialModel(dataSave).save()
        .then((result) => {
            const data = {
                _status: true,
                _message: "Record created succussfully.",
                _data: result,
            }
            response.send(data);
        })
        .catch((error) => {

            var errorMessages = {};

            for (let key in error.errors) {
                errorMessages[key] = error.errors[key].message
            }
            const data = {
                _status: false,
                _message: "Something went wrong.",
                _data: null,
                _error: errorMessages

            }
            response.send(data);

        })

}
exports.view = async (request, response) => {


    // var filter = {
    //     deleted_at : null,
    //     // status : true
    // }
    var sorting ={
        _id : "desc"
    }
    var limit = 15 ;
    var skip = 0 ;
    var page = 1;

    


    // if(request.body){
    //     if(request.body.sorting == 1 ){
    //         sorting = {
    //             name :"asc",
    //             order: "asc",
    //             id : "desc"
    //         }
    //     }
    // }
    //  else if(request.body){
    //     if(request.body.sorting == 2 ){
    //         sorting = {
    //             name :"desc",
    //             order : "desc",
    //             id : "desc"
    //         }
    //     }
    // }

    // body k ander s value nikalni h to es condition ko laga na h ye LIMIT
    
    if(request.body){
        if(request.body.limit != undefined && request.body.limit != ''){
            limit = request.body.limit;
        }
    }

    // skip

    // if(request.body){
    //     if(request.body.skip != undefined && request.body.skip != ''){
    //         skip = request.body.skip;
    //     }
    // }

    //PAGE

    if(request.body){
        if(request.body.page != undefined && request.body.page != ''){
            page = request.body.page;
            skip = (page-1) * limit
        }
    }

    //order ki value graterthan or equal to  

    // if(request.body){
    //     if(request.body.order != undefined && request.body.order != ''){
    //         filter.order = {
    //             $gte: request.body.order
    //         }
    //     }
    // }         

    //name se serch karne k liye


    // if(request.body){
    //     if(request.body.name != undefined && request.body.name != ''){
    //         filter.name = request.body.name;

    //     }
    // }
    // console.log(filter)  
    
    
    //And condition start
    var andCondition =[{
        deleted_at : null,
    }]

    //OR CONDITION START
    var orCondition =[];

    //NAME SE MATCH 

        if(request.body){
        if(request.body.name!= undefined && request.body.name != ''){
            var nameRegex = new RegExp("^" + request.body.name ,'i')
            andCondition.push({ name : nameRegex})
        
    }

    // ORDER SE MATCH KARANA H

    
        if(request.body.order!= undefined && request.body.order != ''){
            andCondition.push({ order : request.body.order})
        
    }
}


    // OR CONDITION S ORDER KO CHECK 

    // if(request.body){
    //     if(request.body.order!= undefined && request.body.order != ''){
    //         orCondition.push({ order : request.body.order})
    //     }
    // }

    // // OR CONDITION KO NAME SE MATCH 

    // if(request.body){
    //     if(request.body.name!= undefined && request.body.name != ''){
    //         orCondition.push({ name : request.body.name})
    //     }
    // }

    filter ={};

    if(andCondition.length >0){
        filter.$and = andCondition;
    }

    if(andCondition.length >0){
        filter.$or = orCondition;
    }
    console.log(filter)



    // TOTAL RECORDS NIKALNE K LIYE
    var totalRecords = await materialModel.find(filter).countDocuments();

    materialModel.find(filter).select('name status order').sort(sorting).limit(limit).skip(skip)
        .then((result) => {
            if (result.length > 0) {
                const data = {
                    _status: true,
                    _message: 'Record fetch succussfully',
                     _paginate:{
                        total_record: totalRecords  ,
                        current_page: page ,
                        total_pages: Math.ceil (totalRecords/limit)  ,
                     },
                    _data: result
                }
                response.send(data);
            } else {
                const data = {
                    _status: false,
                    _message: 'No record found.',
                    _data: result
                }
                response.send(data);
            }
        })
        .catch((error) => {
            const data = {
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            }
            response.send(data);
        })

}

exports.details = async (request, response) => {
    materialModel.findOne({
        _id: request.params.id,
        deleted_at: null
    })
        .then((result) => {
            if (result) {
                const data = {
                    _status: true,
                    _message: 'Record fetch succussfully',
                    _data: result

                }
                response.send(data);
            } else {
                const data = {
                    _status: false,
                    _message: 'No record found.',
                    _data: result


                }
                response.send(data)

            }

        })
        .catch((error) => {
            const data = {
                _status: false,
                _message: 'Something went wrong',
                _data: null,
            }
            response.send(data);
        })

}

exports.update = async (request, response) => {
    const dataSave = request.body;
    dataSave.updated_at = Date.now()

    materialModel.updateOne(
        {
            _id: request.params.id
        },
        {
            $set: dataSave

        }
    )
       .then((result) => {
        if (result.matchedCount> 0) {
            const data = {
                _status: true,
                _message: 'Record updated succussfully',
                _data: result
            }
            response.send(data);
        } else {
            const data = {
                _status: false,
                _message: 'No record found.',
                _data: result
            }
            response.send(data);
        }
    })
        .catch((error) => {
            const data = {
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            }
            response.send(data);
        })

}

exports.changeStatus = async (request, response) => {

    materialModel.updateMany(

        {
            _id: request.body.ids
        },
        [
            {
                $set : {
                    status : {$not: "$status"} ,
                    updated_at: Date.now()            // jab status true ho to false false ho to true 
                }
            }
        ],
        {
            updatePipeline: true
        }
    )
     .then((result) => {
        if (result.matchedCount> 0) {
            const data = {
                _status: true,
                _message: ' change status  succussfully',
                _data: result
            }
            response.send(data);
        } else {
            const data = {
                _status: false,
                _message: 'No record found.',
                _data: result
            }
            response.send(data);
        }
    })
        .catch((error) => {
            const data = {
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            }
            response.send(data);
        })

}
exports.destroy = async (request, response) => {
    

    materialModel.updateMany(
        {
            _id: request.body.id
        },
        {
            $set: {
                deleted_at:Date.now()
            }

        }
    )
       .then((result) => {
        if (result.matchedCount> 0) {
            const data = {
                _status: true,
                _message: 'Record deleted succussfully',
                _data: result
            }
            response.send(data);
        } else {
            const data = {
                _status: false,
                _message: 'No record found.',
                _data: result
            }
            response.send(data);
        }
    })
        .catch((error) => {
            const data = {
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            }
            response.send(data);
        })


}