
const mongoose = require('mongoose');
const schema = new mongoose.Schema({

   
    name : {   
        type : String,
        required : [true , 'Name is required'],
        match: [/^[a-zA-Z0-9 -]{2,30}$/, 'Name is invalid'],
        validate: {
            validator: async function (v) {
                const existing = await this.constructor.findOne({ name: v, deleted_at: null })
                if (!existing) return true
                if (this._id) return existing._id.equals(this._id)
                return false
            },
            message: props => 'The specified name is already in use'
        }
    },
        email : {
        type : String,
        required : [true , 'Email is required'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email is invalid'],
        validate: {
            validator: async function (v) {
                const existing = await this.constructor.findOne({ email: v, deleted_at: null, role_type: 'user' })
                if (!existing) return true
                if (this._id) return existing._id.equals(this._id)
                return false
            },
            message: props => 'The specified email is already in use'
        }
    },
 mobile_number: {
    type: String,
    match: [/^[0-9]{8,15}$/, ],
    default:''
},
 password: {
    type: String,
    required: [true, 'password is required'],
    
},
 Gender: {
    type: String,
    default:'',
    enum:['','male','female']
    
},
 Address: {
    type: String,
    default:''
    
},
billing_address: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
},
shipping_address: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
},
role_type: {
    type: String,
    required:[true,'roleType is required'],
    enum:['user','admin']
    
},
        
        
    image : {   
        type : String,
        default : "",
    },
    // order : {
    //     type : Number,
    //     required : [true , 'Order is required'],
    //     minLength : [2 ,'minimum character must be atleast 3 character'],
    //     maxLength :  [25,'maximum character must be atleast 25 character']
    // },
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
    resetPasswordToken: {
        type: String,
        default: ''
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }

    })


const userModel = mongoose.model('users',schema);

module.exports = userModel;
