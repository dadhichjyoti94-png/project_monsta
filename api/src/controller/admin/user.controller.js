const userModel = require('../../modles/user');

// Admin panel: registered customer/users ki list.
exports.view = async (request, response) => {
    try {
        const limit = Number(request.body.limit) || 15;
        const page = Number(request.body.page) || 1;
        const skip = (page - 1) * limit;

        const filter = {
            role_type: 'user',
            deleted_at: null
        };

        // Name ya email se optional search.
        if (request.body.name) {
            filter.name = new RegExp(request.body.name, 'i');
        }

        if (request.body.email) {
            filter.email = new RegExp(request.body.email, 'i');
        }

        const totalRecords = await userModel.countDocuments(filter);
        const users = await userModel
            .find(filter)
            .select('name email image mobile_number gender address status created_at')
            .sort({ _id: -1 })
            .limit(limit)
            .skip(skip);

        return response.send({
            _status: true,
            _message: users.length ? 'Users fetched successfully.' : 'No users found.',
            _paginate: {
                total_records: totalRecords,
                current_page: page,
                total_page: Math.ceil(totalRecords / limit) || 1
            },
            _data: users
        });
    } catch (error) {
        return response.status(500).send({
            _status: false,
            _message: 'Something went wrong.',
            _data: [],
            _error: error.message
        });
    }
};

exports.details = async (request, response) => {
    try {
        const user = await userModel
            .findOne({ _id: request.params.id, role_type: 'user', deleted_at: null })
            .select('name email mobile_number Gender Address status image');

        return response.send({
            _status: Boolean(user),
            _message: user ? 'User fetched successfully.' : 'No user found.',
            _data: user
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

exports.update = async (request, response) => {
    try {
        const userId = request.params.id;
        const existingEmail = await userModel.findOne({
            _id: { $ne: userId },
            email: request.body.email,
            role_type: 'user',
            deleted_at: null
        });

        if (existingEmail) {
            return response.send({
                _status: false,
                _message: 'Email already exists.'
            });
        }

        const dataSave = {
            name: request.body.name,
            email: request.body.email,
            mobile_number: request.body.mobile_number || '',
            Gender: request.body.Gender || '',
            Address: request.body.Address || '',
            status: request.body.status === 'false' ? false : Boolean(request.body.status),
            updated_at: new Date()
        };

        const result = await userModel.updateOne(
            { _id: userId, role_type: 'user', deleted_at: null },
            { $set: dataSave }
        );

        return response.send({
            _status: result.matchedCount > 0,
            _message: result.matchedCount > 0 ? 'User updated successfully.' : 'No user found.',
            _data: result
        });
    } catch (error) {
        const errorMessages = {};
        if (error.errors) {
            for (const key in error.errors) {
                errorMessages[key] = error.errors[key].message;
            }
        }

        return response.status(500).send({
            _status: false,
            _message: 'Something went wrong.',
            _error: Object.keys(errorMessages).length ? errorMessages : error.message
        });
    }
};

// Selected users ka active/inactive status toggle karta hai.
exports.changeStatus = async (request, response) => {
    try {
        const ids = request.body.ids;
        if (!Array.isArray(ids) || ids.length === 0) {
            return response.send({ _status: false, _message: 'Select at least one user.' });
        }

        const result = await userModel.updateMany(
            { _id: { $in: ids }, role_type: 'user', deleted_at: null },
            [{ $set: { status: { $not: '$status' }, update_at: new Date() } }],
            // Array update MongoDB pipeline hota hai; Mongoose ko explicitly allow karna padta hai.
            { updatePipeline: true }
        );

        return response.send({
            _status: result.matchedCount > 0,
            _message: result.matchedCount > 0 ? 'User status changed successfully.' : 'No user found.',
            _data: result
        });
    } catch (error) {
        return response.status(500).send({ _status: false, _message: 'Something went wrong.', _error: error.message });
    }
};

// Soft delete: data database mein rehta hai, bas listing se hide hota hai.
exports.destroy = async (request, response) => {
    try {
        const ids = request.body.ids;
        if (!Array.isArray(ids) || ids.length === 0) {
            return response.send({ _status: false, _message: 'Select at least one user.' });
        }

        const result = await userModel.updateMany(
            { _id: { $in: ids }, role_type: 'user', deleted_at: null },
            { $set: { deleted_at: new Date(), update_at: new Date() } }
        );

        return response.send({
            _status: result.matchedCount > 0,
            _message: result.matchedCount > 0 ? 'User deleted successfully.' : 'No user found.',
            _data: result
        });
    } catch (error) {
        return response.status(500).send({ _status: false, _message: 'Something went wrong.', _error: error.message });
    }
};
