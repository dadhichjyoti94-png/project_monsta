// MONGOOSE KO ADD KARNA

const mongoose = require('mongoose');
const validate = require('../middleware/admin/materialniddleware');

//Mongoose k ander schema ko add karna h to new kew word k sath

// console.log(error)

const schema = new mongoose.Schema({

    //kon kon s keys data base m hona chiye

    name : {   
        type : String,
        required : [true , 'Name is required'],
        match : [/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/], 
        validate: {
            validator: async function (v) {
                const name = await this.constructor.findOne({name : v,deleted_at : null })
                return !name
            },
            message: props => 'The specified name is already in use'   
        }
    },
    order : {
        type : Number,
        required : [true , 'Order is required'],
        minLength : [2 ,'minimum character must be atleast 3 character'],
        maxLength :  [25,'maximum character must be atleast 25 character']
    },
    status: {
        type : Boolean,
        default : 1
    },
    created_at : {
        type : Date,
        default : Date()
    },
    updated_at : {
        type : Date,
        default : Date()
    },
    deleted_at : {
        type : Date,
        default : null
    },

});

//material model k ander collection ka name or konsa shema follow karna h

const materialModel = mongoose.model('materials',schema);

module.exports = materialModel;