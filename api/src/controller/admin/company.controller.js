const companyModel = require('../../modles/company');

const getCompany = async (request, response) => {
    try {
        const company = await companyModel.findOne({ admin_id: request.admin._id });

        return response.send({
            _status: true,
            _message: company ? 'Company profile fetched successfully.' : 'Company profile not found.',
            _data: company
        });
    } catch (error) {
        return response.status(500).send({
            _status: false,
            _message: 'Something went wrong.',
            _data: null,
            _error: error.message
        });
    }
};

const getPublicCompany = async (request, response) => {
    try {
        const company = await companyModel
            .findOne()
            .sort({ updated_at: -1 })
            .select('company_name email mobile_number address city state country pincode website');

        return response.send({
            _status: true,
            _message: company ? 'Company information fetched successfully.' : 'Company information not found.',
            _data: company
        });
    } catch (error) {
        return response.status(500).send({
            _status: false,
            _message: 'Something went wrong.',
            _data: null,
            _error: error.message
        });
    }
};

const updateCompany = async (request, response) => {
    try {
        const body = request.body || {};
        const companyName = body.company_name || body.companyName || body.name;
        const existingCompany = await companyModel.findOne({ admin_id: request.admin._id });

        if (!existingCompany && !companyName) {
            return response.status(422).send({
                _status: false,
                _message: 'Company name is required.',
                _data: null
            });
        }

        const data = { admin_id: request.admin._id };
        const fieldMap = {
            contact_person: ['contact_person', 'contactPerson'],
            email: ['email'],
            mobile_number: ['mobile_number', 'mobileNumber', 'phone'],
            address: ['address'],
            city: ['city'],
            state: ['state'],
            country: ['country'],
            pincode: ['pincode', 'pinCode', 'postalCode'],
            gst_number: ['gst_number', 'gstNumber', 'gst'],
            website: ['website'],
            logo: ['logo']
        };

        if (companyName) data.company_name = companyName;
        Object.entries(fieldMap).forEach(([field, aliases]) => {
            const providedAlias = aliases.find((alias) => body[alias] !== undefined);
            if (providedAlias) data[field] = body[providedAlias];
        });

        const company = await companyModel.findOneAndUpdate(
            { admin_id: request.admin._id },
            { $set: data },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        return response.send({
            _status: true,
            _message: 'Company profile saved successfully.',
            _data: company
        });
    } catch (error) {
        return response.status(500).send({
            _status: false,
            _message: 'Something went wrong.',
            _data: null,
            _error: error.message
        });
    }
};

module.exports = { getCompany, getPublicCompany, updateCompany };
