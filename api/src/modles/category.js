// MONGOOSE KO ADD KARNA

const mongoose = require('mongoose');
// const validate = require('../middleware/admin/materialniddleware');

//Mongoose k ander schema ko add karna h to new kew word k sath



const schema = new mongoose.Schema({

    //kon kon s keys data base m hona chiye

    name : {   
        type : String,
        required : [true , 'Name is required'],
        match : [/^[a-zA-Z -]{2,30}$/, 'Name is invalid'], 
        // validate: {
        //     validator: async function (v) {
        //         const name = await this.constructor.findOne({name : v,deleted_at : null })
        //         return !name
        //     },
        //     message: props => 'The specified name is already in use'   
        // }
    },
        slug : {   
        type : String,
        required : [true , 'slug is required'],
        validate: {
            validator: async function (v) {
                const slug = await this.constructor.findOne({slug : v,deleted_at : null })
                return !slug
            },
            message: props => 'The specified slug is already in use'   
        }
    },
    image : {   
        type : String,
        default : "",
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

    })

//material model k ander collection ka name or konsa shema follow karna h

const categoryModel = mongoose.model('categories',schema);

module.exports = categoryModel;