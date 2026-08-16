const sliderModel = require("../../modles/slider")
exports.create = async (req, res) => {

    let dataSave = req.body;

    if (req.file) {
        dataSave.image = req.file.filename;
    }

    sliderModel(dataSave)
        .save()
        .then((result) => {
            res.send({
                _status: true,
                _message: "Slider Added Successfully",
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

}

exports.view = async (req, res) => {

    req.body = req.body || {};

    let sorting = {
        order: 1,
        _id: -1
    };

    let filter = {
        deleted_at: null
    };

    try {

        let result = await sliderModel.find(filter).sort(sorting);

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

    } catch (error) {

        res.send({
            _status: false,
            _message: "Something went wrong",
            _data: []
        });

    }

}

exports.changeStatus = async (request, response) => {

    sliderModel.updateMany(

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
exports.update = async (req, res) => {

    let dataSave = req.body;

    dataSave.updated_at = Date.now();

    if (req.file) {
        dataSave.image = req.file.filename;
    }

    sliderModel.updateOne(
        { _id: req.params.id },
        {
            $set: dataSave
        }
    )
    .then((result)=>{
        res.send({
            _status:true,
            _message:"Updated Successfully",
            _data:result
        })
    });

}
exports.destroy = async (req, res) => {

    sliderModel.updateMany(

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
        });

    });

}
exports.details = async (req, res) => {

    try {

        const result = await sliderModel.findById(req.params.id);

        if (result) {
            res.send({
                _status: true,
                _message: "Record fetched successfully",
                _data: result
            });
        } else {
            res.send({
                _status: false,
                _message: "No Record Found",
                _data: {}
            });
        }

    } catch (error) {

        res.send({
            _status: false,
            _message: "Something went wrong",
            _data: {}
        });

    }

}