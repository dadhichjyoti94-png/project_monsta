
const categoryModel = require("../../modles/category");
var slugify = require("slugify")
require('dotenv').config()


console.log(`Hello ${process.env.HELLO}`)


//AUTOMATIC SLUG GENRATE KARNE K LIYE
const generateUniqueSlug = async (Model, baseSlug) => {
    let slug = baseSlug;
    let count = 0;

    // Loop to find unique slug
    while (await Model.findOne({ slug })) {
        count++;
        slug = `${baseSlug}-${count}`;
    }

    return slug;
};

exports.create = async (request, response) => {
    var dataSave = {}

    //upload simgle file

    console.log(request.file)

    //upload multipal image
    // console.log(request.files)
    // datasave variale m keys ko save kara diya
    if (request.body) {
        dataSave = request.body;

    }

    if (request.file) {
        dataSave.image = request.file.filename
    } else {
        dataSave.image = "" // Default empty string if no image uploaded
    }
    // IMAGE UPLOAD CONDITION
    if (request.body) {
        if (request.body.slug == undefined || request.body.slug == "") {
            var slug = slugify(request.body.name, {
                lower: true,
                strict: true,

            })
            dataSave.slug = await generateUniqueSlug(categoryModel, slug);

        } else {
            var slug = slugify(request.body.slug, {
                lower: true,
                strict: true,

            })
            dataSave.slug = await generateUniqueSlug(categoryModel, slug);
        }
    }


    // insert ki query

    categoryModel(dataSave).save()
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
    var sorting = {
        _id: "desc"
    }
    var limit = 15;
    var skip = 0;
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

    if (request.body) {
        if (request.body.limit != undefined && request.body.limit != '') {
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

    if (request.body) {
        if (request.body.page != undefined && request.body.page != '') {
            page = request.body.page;
            skip = (page - 1) * limit
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
    var andCondition = [{
        deleted_at: null,
    }]

    //OR CONDITION START
    var orCondition = [];

    //NAME SE MATCH 

    if (request.body) {
        if (request.body.name != undefined && request.body.name != '') {
            var nameRegex = new RegExp(request.body.name, 'i');
            andCondition.push({ name: nameRegex });

        }

        // ORDER SE MATCH KARANA H


        if (request.body.order != undefined && request.body.order != '') {
            andCondition.push({ order: request.body.order })

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

    var filter = {};

    if (andCondition.length > 0) {
        filter.$and = andCondition;
    }

    if (orCondition.length > 0) {
        filter.$or = orCondition;
    }

    console.log(process.env.image_url)
    // console.log(process.env.image_url)



    // TOTAL RECORDS NIKALNE K LIYE
    var totalRecords = await categoryModel.find(filter).countDocuments();

    categoryModel.find(filter).select('name slug image status order').sort(sorting).limit(limit).skip(skip)
        .then((result) => {
            if (result.length > 0) {
                const data = {
                    _status: true,
                    _message: 'Record fetch succussfully',
                    _image_path: `${process.env.image_url}/category`,
                    _paginate: {
                        total_record: totalRecords,
                        current_page: page,
                        total_pages: Math.ceil(totalRecords / limit),
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
    categoryModel.findOne({
        _id: request.params.id,
        deleted_at: null
    })
        .then((result) => {
            if (result) {
                const data = {
                    _status: true,
                    _message: 'Record fetch succussfully',
                    _image_path: `${process.env.image_url}/category`,
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

    //image ko save karnr k liye

    if (request.file) {
        dataSave.image = request.file.filename
    }


    var getDetails = await categoryModel.findOne({ _id: request.params.id });

    console.log(getDetails)
    // if ( request.body.slug!=undefined) {

    if (request.body.slug == undefined || request.body.slug == "") {
        var slug = slugify(request.body.name, {
            lower: true,
            strict: true,

        })
        dataSave.slug = await generateUniqueSlug(categoryModel, slug);

    } else {
        var slug = slugify(request.body.slug, {
            lower: true,
            strict: true,

        })
        dataSave.slug = await generateUniqueSlug(categoryModel, slug);
    }
    // }

    dataSave.updated_at = Date.now()

    categoryModel.updateOne(
        {
            _id: request.params.id
        },
        {
            $set: dataSave

        }
    )
        .then((result) => {
            if (result.matchedCount > 0) {
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

    categoryModel.updateMany(

        {
            _id: request.body.ids
        },
        [
            {
                $set: {
                    status: { $not: "$status" },
                    updated_at: Date.now()            // jab status true ho to false false ho to true 
                }
            }
        ],
        {
            updatePipeline: true
        }
    )
        .then((result) => {
            if (result.matchedCount > 0) {
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


    categoryModel.updateMany(
        {
            _id: request.body.id
        },
        {
            $set: {
                deleted_at: Date.now()
            }

        }
    )
        .then((result) => {
            if (result.matchedCount > 0) {
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