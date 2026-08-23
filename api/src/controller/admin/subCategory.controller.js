
// function bana rahe h or sath m export kar rahr h

// const materialModel = require("../../modles/material");
const categoryModel = require("../../modles/category");
const SubCategoryModel = require("../../modles/subCategory");
const slugify = require("slugify");

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


exports.parentCategory = async (request, response) => {



    var sorting = {
        _id: "desc"
    }

    //And condition start
    var andCondition = [{
        deleted_at: null,
    }]

    //OR CONDITION START
    var orCondition = [];

    //NAME SE MATCH 

    if (request.body) {
        if (request.body.status != undefined && request.body.status != '') {
            orCondition.push({ status: request.body.status })

        }

        // ORDER SE MATCH KARANA H


        if (request.body.id != undefined && request.body.id != '') {
            orCondition.push({ _id: request.body.id })

        }
    }

    filter = {};

    if (andCondition.length > 0) {
        filter.$and = andCondition;
    }

    if (andCondition.length > 0) {
        filter.$or = orCondition;
    }
    // console.log(filter)


    //  categoryModel.find(filter)
    categoryModel.find(filter).select('name').sort(sorting)
        .then((result) => {
            if (result.length > 0) {
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

exports.create = async (request, response) => {
    // datasave variale m keys ko save kara diya
    
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
    
    var dataSave = {}

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
            dataSave.slug = await generateUniqueSlug(SubCategoryModel, slug);

        } else {
            var slug = slugify(request.body.slug, {
                lower: true,
                strict: true,

            })
            dataSave.slug = await generateUniqueSlug(SubCategoryModel, slug);
        }
    }


    // insert ki query

    // create ki query

    SubCategoryModel(dataSave).save()
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


    var sorting = {
        _id: "desc"
    }
    var limit = 15;
    var skip = 0;
    var page = 1;


    // body k ander s value nikalni h to es condition ko laga na h ye LIMIT

    if (request.body) {
        if (request.body.limit != undefined && request.body.limit != '') {
            limit = request.body.limit;
        }
    }

    // skip

    // var orCondition = []

    //PAGE




    //order ki value graterthan or equal to  





    //And condition start
    var andCondition = [{
        deleted_at: null,
    }]

    //OR CONDITION START
    var orCondition = [];

    //NAME SE MATCH 

    if (request.body) {
        if (request.body.name != undefined && request.body.name != '') {
            var nameRegex = new RegExp("^" + request.body.name, 'i')
            andCondition.push({ name: nameRegex })

        }
    }

    // ORDER SE MATCH KARANA H


    if (request.body) {
        if (request.body.parent_category_id != undefined && request.body.parent_category_id != '') {
            andCondition.push({ parent_category_id: request.body.parent_category_id })
        }
    }




    filter = {};

    if (andCondition.length > 0) {
        filter.$and = andCondition;
    }

    if (orCondition.length > 0) {
        filter.$or = orCondition;
    }
    // console.log(filter)



    // TOTAL RECORDS NIKALNE K LIYE
    var totalRecords = await SubCategoryModel.find(filter).countDocuments();

   SubCategoryModel.find(filter)
    .select('name parent_category_id slug image status order')
    .populate('parent_category_id', 'name')
    .sort(sorting).limit(limit).skip(skip)
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
    SubCategoryModel.findOne({
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
    if (request.file) {
        dataSave.image = request.file.filename;
    }
    var getDetails = await SubCategoryModel.findOne({ _id: request.params.id });

    if (getDetails.slug != request.body.slug) {
        if (request.body.slug == undefined || request.body.slug == '') {
            var slug = slugify(request.body.name, {
                lower: true,
                strict: true,

            })
            dataSave.slug = await generateUniqueSlug(SubCategoryModel, slug);

        } else {
            var slug = slugify(request.body.slug, {
                lower: true,
                strict: true,

            })
            dataSave.slug = await generateUniqueSlug(SubCategoryModel, slug);
        }
    }
    dataSave.updated_at = Date.now()

    SubCategoryModel.updateOne(
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
console.log(request.body)
    SubCategoryModel.updateMany(

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


    SubCategoryModel.updateMany(
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