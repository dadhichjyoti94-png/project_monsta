const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../../modles/user');

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || process.env.secret_key;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000
};

const clearCookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
};

const sanitizeAdmin = (admin) => {
    if (!admin) return null;

    const adminObject = admin.toObject ? admin.toObject() : { ...admin };
    delete adminObject.password;
    delete adminObject.resetPasswordToken;
    delete adminObject.resetPasswordExpires;
    adminObject.role = adminObject.role || adminObject.role_type || 'admin';

    return adminObject;
};

const createToken = (admin) => {
    return jwt.sign(
        {
            adminData: {
                _id: admin._id,
                email: admin.email,
                role_type: admin.role_type,
                role: 'admin'
            }
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

exports.register = async (request, response) => {
    try {
        const { name, email, password } = request.body || {};

        if (!name) return response.send({ _status: false, _message: 'Name is required.', _data: null });
        if (!email) return response.send({ _status: false, _message: 'Email is required.', _data: null });
        if (!password) return response.send({ _status: false, _message: 'Password is required.', _data: null });

        const existingAdmin = await userModel.findOne({ email, role_type: 'admin', deleted_at: null });

        if (existingAdmin) {
            return response.send({ _status: false, _message: 'Admin email already exists.', _data: null });
        }

        const admin = await userModel({
            ...request.body,
            password: await bcrypt.hash(password, saltRounds),
            role_type: 'admin',
            status: request.body.status === undefined ? true : request.body.status
        }).save();

        return response.send({
            _status: true,
            _message: 'Admin registered successfully.',
            _data: sanitizeAdmin(admin)
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
            _data: null,
            _error: Object.keys(errorMessages).length ? errorMessages : error.message
        });
    }
};

exports.login = async (request, response) => {
    try {
        const { email, username, password } = request.body || {};
        const loginId = email || username;

        if (!loginId) return response.send({ _status: false, _message: 'Email or username is required.', _data: null });
        if (!password) return response.send({ _status: false, _message: 'Password is required.', _data: null });
        if (!JWT_SECRET) return response.status(500).send({ _status: false, _message: 'JWT secret is not configured.', _data: null });

        const admin = await userModel.findOne({
            $or: [{ email: loginId }, { name: loginId }],
            role_type: 'admin',
            deleted_at: null
        });

        if (!admin) return response.send({ _status: false, _message: 'Admin not found.', _data: null });

        const isPasswordMatch = await bcrypt.compare(password, admin.password);

        if (!isPasswordMatch) {
            return response.send({ _status: false, _message: 'Wrong credentials.', _data: null });
        }

        if (!admin.status) {
            return response.send({ _status: false, _message: 'Admin account is inactive.', _data: null });
        }

        const token = createToken(admin);

        response.cookie('admin_token', token, cookieOptions);

        return response.send({
            _status: true,
            _message: 'Admin login successfully.',
            _token: token,
            _data: sanitizeAdmin(admin)
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

exports.profile = async (request, response) => {
    return response.send({
        _status: true,
        _message: 'Admin profile fetched successfully.',
        _data: sanitizeAdmin(request.admin)
    });
};

exports.logout = async (request, response) => {
    response.clearCookie('admin_token', clearCookieOptions);

    return response.send({
        _status: true,
        _message: 'Admin logout successfully.',
        _data: null
    });
};
