const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true
    },
    company_name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    contact_person: { type: String, trim: true, default: '' },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: '',
        match: [/^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email is invalid']
    },
    mobile_number: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
    gst_number: { type: String, trim: true, uppercase: true, default: '' },
    website: { type: String, trim: true, default: '' },
    logo: { type: String, trim: true, default: '' }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('companies', companySchema);
