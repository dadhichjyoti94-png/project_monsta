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
     parent_category_id :{
        type :  String,
        required :[true, 'parent category is required'],
        ref :'categories'
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
   
     image : {   
        type : String,
        default : "",
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

const SubCategoryModel = mongoose.model('sub_categories',schema);

module.exports = SubCategoryModel;