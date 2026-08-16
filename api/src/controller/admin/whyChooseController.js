const { ObjectId } = require("mongodb");
// const whyChooseModel = require("../../model/whyChooseModel");
// const whyChooseModel = require("../../modles/whyChooseModel"
const whyChooseModel = require("../../modles/whyChooseModel");

// CREATE
let whyChooseCreate = async (req, res) => {
    try {
        let {
            _whyChooseTitle,
            _whyChooseOrder
        } = req.body;

        // duplicate title check
        const regex = new RegExp(
            `^${_whyChooseTitle.trim()}$`,
            "i"
        );

        let checkTitle = await whyChooseModel.findOne({
            _whyChooseTitle: regex,
            _whyChoose_Deleted_at: null
        });

        if (checkTitle) {
            return res.send({
                _status: false,
                _message: "Title Already Used"
            });
        }

        // duplicate order check
        let checkOrder = await whyChooseModel.findOne({
            _whyChooseOrder,
            _whyChoose_Deleted_at: null
        });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Display Order Already Used"
            });
        }

        let insertObj = { ...req.body };

        if (req.file) {
            if (req.file.filename) {
                insertObj.image = req.file.filename;
            }
        }

        let insertRes =
            await whyChooseModel.create(insertObj);

        return res.send({
            _status: true,
            _message: "Why Choose Us Created",
            insertRes
        });

    } catch (error) {
    console.log(error);

    return res.send({
        _status: false,
        message: error.message,
        error
    });
}
};

// VIEW ALL
let whyChooseView = async (req, res) => {
    try {
        let data = await whyChooseModel.find({
            _whyChoose_Deleted_at: null
        });

        return res.send({
            _status: true,
            _message: "Why Choose Us Viewed",
            path: process.env.image_url + "/whychooseus/",
            data
        });

    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error while fetching data"
        });
    }
};

// DELETE
let whyChooseDelete = async (req, res) => {
    try {
        let { ids } = req.body;

        let delRes =
            await whyChooseModel.updateMany(
                { _id: ids },
                {
                    $set: {
                        _whyChoose_Deleted_at: Date.now()
                    }
                }
            );

        return res.send({
            _status: true,
            _message: "Why Choose Us Deleted",
            delRes
        });

    } catch (error) {
        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

// STATUS CHANGE
let whyChooseChangeStatus = async (req, res) => {
    try {
        let { ids } = req.body;

        if (!ids || ids.length === 0) {
            return res.send({
                _status: false,
                _message: "Please Select Data"
            });
        }

        let rows = await whyChooseModel.find({
            _id: { $in: ids }
        });

        for (let item of rows) {
            await whyChooseModel.updateOne(
                { _id: item._id },
                {
                    $set: {
                        _whyChooseStatus: !item._whyChooseStatus
                    }
                }
            );
        }

        return res.send({
            _status: true,
            _message: "Status Changed Successfully"
        });

    } catch (error) {
        console.log(error);

        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

// UPDATE
let whyChooseUpdate = async (req, res) => {
    try {
        let { id } = req.params;

        let {
            _whyChooseTitle,
            _whyChooseOrder
        } = req.body;

        // duplicate title
        let checkTitle =
            await whyChooseModel.findOne({
                _whyChooseTitle,
                _whyChoose_Deleted_at: null,
                _id: { $ne: new ObjectId(id) }
            });

        if (checkTitle) {
            return res.send({
                _status: false,
                _message: "Title Already Used"
            });
        }

        // duplicate order
        let checkOrder =
            await whyChooseModel.findOne({
                _whyChooseOrder,
                _whyChoose_Deleted_at: null,
                _id: { $ne: new ObjectId(id) }
            });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Display Order Already Used"
            });
        }

        let updateObj = { ...req.body };

        if (req.file) {
            if (req.file.filename) {
                updateObj.image = req.file.filename;
            }
        }

        let updateRes =
            await whyChooseModel.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateObj }
            );

        return res.send({
            _status: true,
            _message: "Why Choose Us Updated Successfully",
            updateRes
        });

    } catch (error) {
        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

// VIEW ONE
let whyChooseViewOne = async (req, res) => {
    try {
        let { id } = req.params;

        let data =
            await whyChooseModel.findOne({
                _id: new ObjectId(id),
                _whyChoose_Deleted_at: null
            });

        if (!data) {
            return res.send({
                _status: false,
                _message: "Data not found"
            });
        }

        return res.send({
            _status: true,
            _message: "Why Choose Us Viewed",
            data
        });

    } catch (error) {
        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

module.exports = {
    whyChooseCreate,
    whyChooseView,
    whyChooseDelete,
    whyChooseChangeStatus,
    whyChooseUpdate,
    whyChooseViewOne
};