// const testimonialModel = require("../../models/testimonial");
// const testimonialModel = require("../../models/testimonial");
const testimonialModel = require("../../modles/testimonial")

exports.create = async (req, res) => {

    let dataSave = req.body;

    if (req.file) {
        dataSave.image = req.file.filename;
    }

    testimonialModel(dataSave).save()
        .then((result) => {

            res.send({
                _status: true,
                _message: "Testimonial Added Successfully",
                _data: result
            })

        })
        .catch((error) => {

            let errorMessages = {};

            for (let key in error.errors) {
                errorMessages[key] = error.errors[key].message;
            }

            res.send({
                _status: false,
                _message: "Something went wrong",
                _error: errorMessages
            })

        })

}
exports.view = async (req, res) => {

    req.body = req.body || {};

    let sorting = {
        order: "asc",
        _id: "desc"
    };

    let limit = 10;
    let skip = 0;
    let page = 1;

    // Limit
    if (req.body.limit != undefined && req.body.limit != "") {
        limit = Number(req.body.limit);
    }

    // Page
    if (req.body.page != undefined && req.body.page != "") {
        page = Number(req.body.page);
        skip = (page - 1) * limit;
    }

    // Filter
    let andCondition = [
        {
            deleted_at: null
        }
    ];

    // Name Search
    if (req.body.name != undefined && req.body.name != "") {
        let regex = new RegExp( req.body.name, "i");

        andCondition.push({
            name: regex
        });
    }

    let filter = {
        $and: andCondition
    };

    try {

        let totalRecords = await testimonialModel.countDocuments(filter);

        let result = await testimonialModel.find(filter)
            .sort(sorting)
            .limit(limit)
            .skip(skip);

        if (result.length > 0) {

            res.send({
                _status: true,
                _message: "Record fetched successfully",
                _paginate: {
                    total_record: totalRecords,
                    current_page: page,
                    total_pages: Math.ceil(totalRecords / limit)
                },
                _data: result
            });

        } else {

            res.send({
                _status: false,
                _message: "No record found.",
                _paginate: {
                    total_record: 0,
                    current_page: page,
                    total_pages: 0
                },
                _data: []
            });

        }

    } catch (error) {

        console.log(error);

        res.send({
            _status: false,
            _message: "Something went wrong.",
            _data: []
        });

    }

}


exports.details = async (req, res) => {

    testimonialModel.findOne({
        _id: req.params.id,
        deleted_at: null
    })

        .then((result) => {

            if (result) {

                res.send({
                    _status: true,
                    _message: "Record Found",
                    _data: result
                })

            } else {

                res.send({
                    _status: false,
                    _message: "No Record Found"
                })

            }

        })

}


exports.update = async (req, res) => {

    let dataSave = req.body;

    dataSave.updated_at = Date.now();

    if (req.file) {
        dataSave.image = req.file.filename;
    }

    testimonialModel.updateOne(
        {
            _id: req.params.id
        },
        {
            $set: dataSave
        }
    )

        .then((result) => {

            res.send({
                _status: true,
                _message: "Updated Successfully",
                _data: result
            })

        })

}

exports.changeStatus = async (req, res) => {

    testimonialModel.updateMany(

        {
            _id: req.body.ids
        },

        [
            {
                $set: {
                    status: {
                        $not: "$status"
                    },
                    updated_at: Date.now()
                }
            }
        ],

        {
            updatePipeline: true
        }

    )

        .then((result) => {

            res.send({
                _status: true,
                _message: "Status Changed Successfully",
                _data: result
            })

        })

}

exports.destroy = async (req, res) => {

    testimonialModel.updateMany(

        {
            _id: req.body.id
        },

        {
            $set: {
                deleted_at: Date.now()
            }
        }

    )

        .then((result) => {

            res.send({
                _status: true,
                _message: "Deleted Successfully",
                _data: result
            })

        })

}