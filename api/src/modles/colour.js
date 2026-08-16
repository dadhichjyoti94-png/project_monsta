// MONGOOSE KO ADD KARNA

const mongoose = require('mongoose');
const validate = require('../middleware/admin/materialniddleware');

//Mongoose k ander schema ko add karna h to new kew word k sath

const schema = new mongoose.Schema({

    //kon kon s keys data base m hona chiye

    name: {
        type: String,
        required: [true, 'Name is required'],
        // match : /^[a-zA-Z]{2,17}$/, 
        validate: {
            validator: async function (v) {
                const name = await this.constructor.findOne({ name: v, deleted_at: null })
                return !name
            },
            message: props => 'The specified name is already in use'
        }
    },

    color_code: {
        type: String,
        required: [true, 'color_code  is required'],
        validate: {
            validator: async function (v) {
                const name = await this.constructor.findOne({ color_code: v, deleted_at: null })
                return !name
            },
            message: props => 'The specified name is already in use'
        }
    },


order :{
    type:Number,
    required:[true ,'Order is required'],
    min :[0,'Minium value 0 is required'],
    max :[1000,'Maximum value is 1000'],

},
    status: {
    type: Boolean,
    default: 1
},
    created_at : {
    type: Date,
    default: Date()
},
    updated_at : {
    type: Date,
    default: Date()
},
    deleted_at : {
    type: Date,
    default: null
},

});

//material model k ander collection ka name or konsa shema follow karna h

const colourlModel = mongoose.model('colours', schema);

module.exports = colourlModel;