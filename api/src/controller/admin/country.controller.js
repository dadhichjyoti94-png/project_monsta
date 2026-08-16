const countryModel = require("../../modles/country");


// CREATE

exports.create = async (request, response) => {

    const dataSave = request.body;

    countryModel(dataSave).save()

        .then((result) => {

            response.send({
                _status: true,
                _message: "Country created successfully.",
                _data: result
            });

        })

        .catch((error) => {

            let errorMessages = {};

            for (let key in error.errors) {
                errorMessages[key] = error.errors[key].message;
            }

            response.send({
                _status: false,
                _message: "Something went wrong.",
                _data: null,
                _error: errorMessages
            });

        });

};



// VIEW

exports.view = async (request, response) => {

    let filter = {
        deleted_at: null
    };

    if (request.body.name) {

        filter.name = new RegExp("^" + request.body.name, "i");

    }

    countryModel.find(filter)

        .sort({ _id: -1 })

        .then((result) => {

            response.send({

                _status: true,

                _message: "Country list",

                _data: result

            });

        })

        .catch(() => {

            response.send({

                _status: false,

                _message: "Something went wrong",

                _data: []

            });

        });

};



// DETAILS

exports.details = async (request, response) => {

    countryModel.findOne({

        _id: request.params.id,

        deleted_at: null

    })

        .then((result) => {

            if (result) {

                response.send({

                    _status: true,

                    _message: "Record found",

                    _data: result

                });

            }

            else {

                response.send({

                    _status: false,

                    _message: "No record found",

                    _data: null

                });

            }

        })

        .catch(() => {

            response.send({

                _status: false,

                _message: "Something went wrong",

                _data: null

            });

        });

};



// UPDATE

exports.update = async (request, response) => {

    const dataSave = request.body;

    dataSave.updated_at = Date.now();

    countryModel.updateOne(

        {

            _id: request.params.id

        },

        {

            $set: dataSave

        }

    )

        .then((result) => {

            if (result.matchedCount > 0) {

                response.send({

                    _status: true,

                    _message: "Country updated successfully",

                    _data: result

                });

            }

            else {

                response.send({

                    _status: false,

                    _message: "No record found",

                    _data: result

                });

            }

        })

        .catch(() => {

            response.send({

                _status: false,

                _message: "Something went wrong",

                _data: []

            });

        });

};



// CHANGE STATUS

exports.changeStatus = async (request, response) => {

    countryModel.updateMany(

        {

            _id: {

                $in: request.body.ids

            }

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

        ]

    )

        .then((result) => {

            response.send({

                _status: true,

                _message: "Status changed successfully",

                _data: result

            });

        })

        .catch(() => {

            response.send({

                _status: false,

                _message: "Something went wrong",

                _data: []

            });

        });

};



// DELETE

exports.destroy = async (request, response) => {

    countryModel.updateMany(

        {

            _id: {

                $in: request.body.ids

            }

        },

        {

            $set: {

                deleted_at: Date.now()

            }

        }

    )

        .then((result) => {

            response.send({

                _status: true,

                _message: "Country deleted successfully",

                _data: result

            });

        })

        .catch(() => {

            response.send({

                _status: false,

                _message: "Something went wrong",

                _data: []

            });

        });

};