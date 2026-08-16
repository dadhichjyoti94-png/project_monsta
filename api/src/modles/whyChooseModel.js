const mongoose = require("mongoose");

const whyChooseSchema = mongoose.Schema({
  _whyChooseTitle: {
    type: String,
    required: [true, "Please Fill Title"],
    minLength: [2, "Please Fill Minimum Two Characters"]
  },

  _whyChooseDescription: {
    type: String,
    required: [true, "Please Fill Description"],
    minLength: [5, "Please Fill Minimum Five Characters"]
  },
   image: {
    type: String,
    required: [true, "Please Upload Image"]
  },

  // _whyChooseIcon: {
  //   type: String,
  //   required: [true, "Please Fill Icon Class"]
  // },

  _whyChooseOrder: {
    type: Number,
    required: [true, "Please Fill Display Order"]
  },

  image: String,

  // _whyChooseStatus: {
  //   type: Boolean,
  //   required: [true, "Please Select Status"],
  //   default: true
  // },

  _whyChoose_Creted_at: {
    type: Date,
    default: new Date()
  },

  _whyChoose_Updated_at: {
    type: Date,
    default: new Date()
  },

  _whyChoose_Deleted_at: {
    type: Date,
    default: null
  }
});

const whyChooseModel = mongoose.model("whychoose", whyChooseSchema);

module.exports = whyChooseModel;