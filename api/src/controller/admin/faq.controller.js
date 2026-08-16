const faqModel = require("../../modles/faq");

// Create
exports.create = async (req, res) => {
    console.log(req.body);

    let dataSave = req.body;

    faqModel(dataSave)
        .save()
        .then((result) => {

            res.send({
                _status: true,
                _message: "FAQ Added Successfully",
                _data: result
            });

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
            });

        });

};

// View
exports.view = async (req, res) => {

    let filter = {
        deleted_at: null
    };

    let sorting = {
        order: 1,
        _id: -1
    };

    try {

        let result = await faqModel.find(filter).sort(sorting);

        if (result.length > 0) {

            res.send({
                _status: true,
                _message: "Record fetched successfully",
                _data: result
            });

        } else {

            res.send({
                _status: false,
                _message: "No Record Found",
                _data: []
            });

        }

    } catch {

        res.send({
            _status: false,
            _message: "Something went wrong",
            _data: []
        });

    }

};

// Details
exports.details = async (req, res) => {

    try {

        let result = await faqModel.findById(req.params.id);

        if (result) {

            res.send({
                _status: true,
                _message: "Record fetched successfully",
                _data: result
            });

        } else {

            res.send({
                _status: false,
                _message: "No Record Found"
            });

        }

    } catch {

        res.send({
            _status: false,
            _message: "Something went wrong"
        });

    }

};

// Update
exports.update = async (req, res) => {

    let dataSave = req.body;

    dataSave.updated_at = Date.now();

    faqModel.updateOne(

        { _id: req.params.id },

        {
            $set: dataSave
        }

    )

        .then((result) => {

            res.send({
                _status: true,
                _message: "Updated Successfully",
                _data: result
            });

        });

};

// Delete
exports.destroy = async (req, res) => {

    faqModel.updateMany(

        {
            _id: {
                $in: req.body.id
            }
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
            });

        });

};

// Change Status
exports.changeStatus = async (req, res) => {

    try {

        const ids = req.body.ids;

        const data = await faqModel.find({
            _id: {
                $in: ids
            }
        });

        for (let item of data) {

            await faqModel.updateOne(

                {
                    _id: item._id
                },

                {
                    $set: {
                        status: item.status == 1 ? 0 : 1,
                        updated_at: Date.now()
                    }
                }

            );

        }

        res.send({
            _status: true,
            _message: "Status Changed Successfully"
        });

    } catch {

        res.send({
            _status: false,
            _message: "Something went wrong"
        });

    }

};