const jwt = require('jsonwebtoken');
const userModel = require('../../modles/user');

const JWT_SECRET = process.env.JWT_SECRET || process.env.secret_key;

const getTokenFromCookie = (cookieHeader) => {
    if (!cookieHeader) return '';

    const cookies = cookieHeader.split(';').reduce((items, cookie) => {
        const [key, ...value] = cookie.trim().split('=');
        items[key] = decodeURIComponent(value.join('='));
        return items;
    }, {});

    return cookies.admin_token || '';
};

const getToken = (request) => {
    const authHeader = request.headers.authorization || '';

    if (authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }

    return getTokenFromCookie(request.headers.cookie);
};

const adminAuth = async (request, response, next) => {
    try {
        if (!JWT_SECRET) {
            return response.status(500).send({
                _status: false,
                _message: 'JWT secret is not configured.',
                _data: null
            });
        }

        const token = getToken(request);

        if (!token) {
            return response.status(401).send({
                _status: false,
                _message: 'Authorization token is required.',
                _data: null
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const adminId = decoded.adminData?._id || decoded.userData?._id || decoded._id;

        if (!adminId || decoded.userData) {
            return response.status(401).send({
                _status: false,
                _message: 'Unauthorized admin.',
                _data: null
            });
        }

        const admin = await userModel
            .findOne({ _id: adminId, role_type: 'admin', deleted_at: null })
            .select('-password -resetPasswordToken -resetPasswordExpires');

        if (!admin) {
            return response.status(401).send({
                _status: false,
                _message: 'Unauthorized admin.',
                _data: null
            });
        }

        if (!admin.status) {
            return response.status(401).send({
                _status: false,
                _message: 'Admin account is inactive.',
                _data: null
            });
        }

        request.admin = admin;
        next();
    } catch (error) {
        const isExpired = error.name === 'TokenExpiredError';

        return response.status(401).send({
            _status: false,
            _message: isExpired ? 'Token expired.' : 'Invalid token.',
            _data: null
        });
    }
};

module.exports = adminAuth;
