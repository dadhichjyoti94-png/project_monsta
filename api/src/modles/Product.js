// MONGOOSE KO ADD KARNA

const mongoose = require('mongoose');
const validate = require('../middleware/admin/materialniddleware');

//Mongoose k ander schema ko add karna h to new kew word k sath

// console.log(error)

const schema = new mongoose.Schema({

    //kon kon s keys data base m hona chiye

    name: {
        type: String,
        required: [true, 'Name is required'],
         match: [/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'Product name is invalid'],
    },
    slug: {
        type: String,
        required: [true, 'slug is required'],
        validate: {
            validator: async function (v) {
                const slug = await this.constructor.findOne({ slug: v, deleted_at: null })
                return !slug
            },
            message: props => 'The specified slug is already in use'
        }
    },
    //  parent_category_id :{

    //     type :  String,
    //     required :[true, 'parent category is required'],
    //     ref :'categories'
    // },
    //    sub_category_id :{
    //     type :  String,
    //     required :[true, 'sub category is required'],
    //     ref :'sub-categories'
    // },
    //  sub_sub_category_id :{
    //     type :  String,
    //     required :[true, 'sub sub category is required'],
    //     ref :'sub-sub-categories'
    // },
    parent_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'parent category is required'],
        ref: 'categories'
    },

    sub_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'sub category is required'],
        ref: 'sub_categories'
    },

    sub_sub_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'sub sub category is required'],
        ref: 'sub_sub_categories'
    },
    color_id: {
        // type: String,
         type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Color  is required'],
        ref: 'colors'
    },
    material_id: {
        // type: String,
         type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Material  is required'],
        ref: 'materials'
    },
    actual_price: {
        type: String,
        required: [true, 'Actual price is required'],
        default: 0,
    },
    sale_price: {
        type: String,
        required: [true, 'Sale price is required'],
        default: 0,
    },
    product_type: {     //1- featured 2- new arrivals  3- onsale
        type: Number,
        required: [true, 'product type is required'],
        default: 0,
    },
    is_trending: {       //1-yes 2-no 
        type: Number,
        required: [true, 'is trending is required'],
        default: 1,
    },
    is_best_selling: {
        type: Number,
        required: [true, 'is best selling is required'],
        default: 1,
    },




    order: {
        type: Number,
        required: [true, 'Order is required'],
        minLength: [2, 'minimum character must be atleast 3 character'],
        maxLength: [25, 'maximum character must be atleast 25 character']
    },
    status: {
        type: Boolean,
        default: 1
    },

    image: {
        type: String,
        default: "",
    },
    images: {
        type: Array,
        default: [],
    },
    sort_description: {
        type: String,
        required: [true, 'Sort Description is required'],

    },
    long_description: {
        type: String,
        required: [true, 'Long Description is required'],

    },
    product_code: {
        type: String,
        required: [true, 'Product code is required'],

    },
    dimenstion: {
        type: String,
        required: [true, 'Dimenstion  is required'],

    },
    estimate_delivery_days: {
        type: String,
        required: [true, 'Estimate Delivery days is required'],

    },
    created_at: {
        type: Date,
        default: Date()
    },
    updated_at: {
        type: Date,
        default: Date()
    },
    deleted_at: {
        type: Date,
        default: null
    },

});

//material model k ander collection ka name or konsa shema follow karna h

const ProductModel = mongoose.model('Product', schema);

module.exports = ProductModel;