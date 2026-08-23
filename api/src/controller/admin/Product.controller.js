const categoryModel = require("../../modles/category");
const SubCategoryModel = require("../../modles/subCategory");
const slugify = require("slugify");
const SubSubCategoryModel = require("../../modles/SubSubCategory");
const materialModel = require("../../modles/material");
const colourlModel = require("../../modles/colour");
const ProductModel = require("../../modles/Product");

const generateUniqueSlug = async (Model, baseSlug) => {
    let slug = baseSlug;
    let count = 0;

    while (await Model.findOne({ slug })) {
        count++;
        slug = `${baseSlug}-${count}`;
    }

    return slug;
};

exports.parentCategory = async (request, response) => {
    var sorting = { _id: "desc" };

    var andCondition = [{ deleted_at: null }];
    var orCondition = [];

    if (request.body) {
        if (request.body.status != undefined && request.body.status != '') {
            orCondition.push({ status: request.body.status });
        }

        if (request.body.id != undefined && request.body.id != '') {
            orCondition.push({ _id: request.body.id });
        }
    }

    filter = {};

    if (andCondition.length > 0) {
        filter.$and = andCondition;
    }

    if (orCondition.length > 0) {
        filter.$or = orCondition;
    }

    categoryModel.find(filter).select('name').sort(sorting)
        .then((result) => {
            response.send({
                _status: result.length > 0,
                _message: result.length > 0 ? 'Record fetch succussfully' : 'No record found.',
                _data: result
            });
        })
        .catch(() => {
            response.send({
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            });
        });
};

exports.subCategory = async (request, response) => {
    var sorting = { _id: "desc" };

    var andCondition = [{ deleted_at: null }];
    var orCondition = [];

    if (request.body) {
        if (request.body.status != undefined && request.body.status != '') {
            orCondition.push({ status: request.body.status });
        }

        if (request.body.parent_category_id != undefined && request.body.parent_category_id != '') {
            andCondition.push({ parent_category_id: request.body.parent_category_id });
        }

        if (request.body.id != undefined && request.body.id != '') {
            orCondition.push({ _id: request.body.id });
        }
    }

    filter = {};

    if (andCondition.length > 0) {
        filter.$and = andCondition;
    }

    if (orCondition.length > 0) {
        filter.$or = orCondition;
    }

    SubCategoryModel.find(filter).select('name').sort(sorting)
        .then((result) => {
            response.send({
                _status: result.length > 0,
                _message: result.length > 0 ? 'Record fetch succussfully' : 'No record found.',
                _data: result
            });
        })
        .catch(() => {
            response.send({
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            });
        });
};

exports.SubSubCategory = async (request, response) => {
    var sorting = { _id: "desc" };

    var andCondition = [{ deleted_at: null }];
    var orCondition = [];

    if (request.body) {
        if (request.body.status != undefined && request.body.status != '') {
            orCondition.push({ status: request.body.status });
        }

        if (request.body.parent_category_id != undefined && request.body.parent_category_id != '') {
            andCondition.push({ parent_category_id: request.body.parent_category_id });
        }

        if (request.body.sub_category_id != undefined && request.body.sub_category_id != '') {
            andCondition.push({ sub_category_id: request.body.sub_category_id });
        }

        if (request.body.id != undefined && request.body.id != '') {
            orCondition.push({ _id: request.body.id });
        }
    }

    filter = {};

    if (andCondition.length > 0) {
        filter.$and = andCondition;
    }

    if (orCondition.length > 0) {
        filter.$or = orCondition;
    }

    SubSubCategoryModel.find(filter).select('name').sort(sorting)
        .then((result) => {
            response.send({
                _status: result.length > 0,
                _message: result.length > 0 ? 'Record fetch succussfully' : 'No record found.',
                _data: result
            });
        })
        .catch((error) => {
            // console.log("SUB SUB CATEGORY BACKEND ERROR =", error)
            response.send({
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            });
        });
};

exports.create = async (request, response) => {
    var dataSave = {};

    if (request.body) {
        dataSave = request.body;
    }

    if (request.files != undefined) {
        if (request.files.image != undefined) {
            dataSave.image = request.files.image[0].filename;
        }

        if (request.files.images != undefined) {
            var images = [];
            request.files.images.forEach((v) => {
                images.push(v.filename);
            });
            dataSave.images = images;
        }
    } else {
        dataSave.image = "";
    }

    if (request.body) {
        if (request.body.slug == undefined || request.body.slug == "") {
            var slug = slugify(request.body.name, {
                lower: true,
                strict: true,
            });
            dataSave.slug = await generateUniqueSlug(ProductModel, slug);
        } else {
            var slug = slugify(request.body.slug, {
                lower: true,
                strict: true,
            });
            dataSave.slug = await generateUniqueSlug(ProductModel, slug);
        }
    }

    ProductModel(dataSave).save()
        .then((result) => {
            response.send({
                _status: true,
                _message: "Record created succussfully.",
                _data: result,
            });
        })
        .catch((error) => {
            var errorMessages = {};

            if (error.errors) {
                for (let key in error.errors) {
                    errorMessages[key] = error.errors[key].message;
                }
            }

            response.send({
                _status: false,
                _message: "Something went wrong.",
                _data: null,
                _error: errorMessages
            });
        });
};

exports.view = async (request, response) => {
    var sorting = { _id: "desc" };
    var limit = 20;
    var skip = 0;
    var page = 1;

    if (request.body) {
        if (request.body.limit != undefined && request.body.limit != '') {
            limit = request.body.limit;
        }
    }

    var andCondition = [{ deleted_at: null }];
    var orCondition = [];

    if (request.body) {
        if (request.body.name != undefined && request.body.name != '') {
            var nameRegex = new RegExp("^" + request.body.name, 'i');
            andCondition.push({ name: nameRegex });
        }

        if (request.body.parent_category_id != undefined && request.body.parent_category_id != '') {
            andCondition.push({ parent_category_id: request.body.parent_category_id });
        }
        if (request.body.sub_category_id != undefined && request.body.sub_category_id != '') {
            andCondition.push({ sub_category_id: request.body.sub_category_id });
        }
        if (request.body.sub_sub_category_id != undefined && request.body.sub_sub_category_id != '') {
            andCondition.push({ sub_sub_category_id: request.body.sub_sub_category_id });
        }
    }

    filter = {};

    if (andCondition.length > 0) {
        filter.$and = andCondition;
    }

    if (orCondition.length > 0) {
        filter.$or = orCondition;
    }

    var totalRecords = await ProductModel.find(filter).countDocuments();

    ProductModel.find(filter)
        .populate('parent_category_id', 'name')
        .populate('sub_category_id', 'name')
        .populate('sub_sub_category_id', 'name')
        .populate('material_id', 'name')
        // .populate('color_id', 'name')
        // .populate('materials_id', 'name')
        // .populate('colours_id', 'name')
        .sort(sorting).limit(limit).skip(skip)
        .then((result) => {
            // console.log("PRODUCT API RESPONSE:", result);
            response.send({

                _status: result.length > 0,
                _message: result.length > 0 ? 'Record fetch succussfully' : 'No record found.',
                _image_path: `${process.env.image_url}/products`,
                _paginate: {
                    total_record: totalRecords,
                    current_page: page,
                    total_pages: Math.ceil(totalRecords / limit),
                },
                _data: result
            });
        })
        .catch((error) => {
            // console.log("PRODUCT VIEW ERROR =>", error);
            response.send({
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            });
        });
};

exports.details = async (request, response) => {
    ProductModel.findOne({
        _id: request.params.id,
        deleted_at: null
    })
        .populate('parent_category_id', 'name')
        .populate('sub_category_id', 'name')
        .populate('sub_sub_category_id', 'name')
        .populate('material_id', 'name')
        // .populate('color_id', 'name')
        .then((result) => {
            response.send({
                _status: result ? true : false,
                _message: result ? 'Record fetch succussfully' : 'No record found.',
                _image_path: `${process.env.image_url}/products`,
                _data: result
            });
        })
        .catch(() => {
    
            response.send({
                _status: false,
                _message: 'Something went wrong',
                _data: null,
            });
        });
};

exports.update = async (request, response) => {
    const dataSave = { ...request.body };
    const getDetails = await ProductModel.findOne({ _id: request.params.id });

    if (request.files != undefined) {
        if (request.files.image != undefined) {
            dataSave.image = request.files.image[0].filename;
        }

        if (request.files.images != undefined) {
            const images = [];
            request.files.images.forEach((v) => {
                images.push(v.filename);
            });
            // The admin sends only newly chosen files during an update. Keep
            // gallery images already stored for this product as well.
            dataSave.images = [...(getDetails?.images || []), ...images];
        }
    }

    if (getDetails && getDetails.slug != request.body.slug) {
        if (request.body.slug == undefined || request.body.slug == '') {
            var slug = slugify(request.body.name, {
                lower: true,
                strict: true,
            });
            dataSave.slug = await generateUniqueSlug(ProductModel, slug);
        } else {
            var slug = slugify(request.body.slug, {
                lower: true,
                strict: true,
            });
            dataSave.slug = await generateUniqueSlug(ProductModel, slug);
        }
    }

    dataSave.updated_at = Date.now();

    ProductModel.updateOne(
        { _id: request.params.id },
        { $set: dataSave }
    )
        .then((result) => {
            response.send({
                _status: result.matchedCount > 0,
                _message: result.matchedCount > 0 ? 'Record updated succussfully' : 'No record found.',
                _data: result
            });
        })
        .catch((error) => {
            // console.log("PRODUCT UPDATE ERROR =>", error)
            response.send({
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            });
        });
};

exports.changeStatus = async (request, response) => {
    ProductModel.updateMany(
        { _id: request.body.ids },
        [
            {
                $set: {
                    status: { $not: "$status" },
                    updated_at: Date.now()
                }
            }
        ]
    )
        .then((result) => {
            response.send({
                _status: result.matchedCount > 0,
                _message: result.matchedCount > 0 ? 'change status succussfully' : 'No record found.',
                _data: result
            });
        })
        .catch(() => {
            response.send({
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            });
        });
};

exports.destroy = async (request, response) => {
    ProductModel.updateMany(
        { _id: request.body.id },
        {
            $set: {
                deleted_at: Date.now()
            }
        }
    )
        .then((result) => {
            response.send({
                _status: result.matchedCount > 0,
                _message: result.matchedCount > 0 ? 'Record deleted succussfully' : 'No record found.',
                _data: result
            });
        })
        .catch(() => {
            response.send({
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            });
        });
};

exports.materials = async (request, response) => {
    var sorting = { _id: "desc" };

    var andCondition = [{ deleted_at: null }];
    var orCondition = [];

    if (request.body) {
        if (request.body.status != undefined && request.body.status != '') {
            orCondition.push({ status: request.body.status });
        }

        if (request.body.id != undefined && request.body.id != '') {
            orCondition.push({ _id: request.body.id });
        }
    }

    filter = {};

    if (andCondition.length > 0) {
        filter.$and = andCondition;
    }

    if (orCondition.length > 0) {
        filter.$or = orCondition;
    }

    materialModel.find(filter).select('name').sort(sorting)
        .then((result) => {
            response.send({
                _status: result.length > 0,
                _message: result.length > 0 ? 'Record fetch succussfully' : 'No record found.',
                _data: result
            });
        })
        .catch(() => {
            response.send({
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            });
        });
};

exports.colours = async (request, response) => {
    var sorting = { _id: "desc" };

    var andCondition = [{ deleted_at: null }];
    var orCondition = [];

    if (request.body) {
        if (request.body.status != undefined && request.body.status != '') {
            orCondition.push({ status: request.body.status });
        }

        if (request.body.id != undefined && request.body.id != '') {
            orCondition.push({ _id: request.body.id });
        }
    }

    filter = {};

    if (andCondition.length > 0) {
        filter.$and = andCondition;
    }

    if (orCondition.length > 0) {
        filter.$or = orCondition;
    }

    colourlModel.find(filter).select('name').sort(sorting)
        .then((result) => {
            response.send({
                _status: result.length > 0,
                _message: result.length > 0 ? 'Record fetch succussfully' : 'No record found.',
                _data: result
            });
        })
        .catch(() => {
            response.send({
                _status: false,
                _message: 'Something went wrong',
                _data: [],
            });
        });
};
