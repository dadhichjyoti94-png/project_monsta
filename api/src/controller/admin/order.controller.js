const orderModel = require('../../modles/order');
const nodemailer = require('nodemailer');

const ORDER_STATUSES = {
    1: 'Order placed',
    2: 'Order received',
    3: 'In transit',
    4: 'Out for delivery',
    5: 'Completed',
    6: 'Cancelled',
    7: 'Failed'
};

exports.view = async (req, res) => {
    try {
        const limit = Math.max(Number(req.body.limit) || 15, 1);
        const page = Math.max(Number(req.body.page) || 1, 1);
        const filter = { deleted_at: null };

        if (req.body.order_status !== undefined && req.body.order_status !== '') {
            filter.order_status = Number(req.body.order_status);
        }

        if (req.body.search && req.body.search.trim()) {
            const search = new RegExp(req.body.search.trim(), 'i');
            filter.$or = [{ order_number: search }, { name: search }, { mobile_number: search }];
        }

        const [orders, totalRecords] = await Promise.all([
            orderModel.find(filter)
            .sort({ created_at: -1, _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
            orderModel.countDocuments(filter)
        ]);

        return res.send({
            _status: true,
            _message: orders.length ? 'Orders fetched successfully.' : 'No orders found.',
            _data: orders,
            _order_statuses: ORDER_STATUSES,
            _paginate: {
                total_records: totalRecords,
                current_page: page,
                total_page: Math.ceil(totalRecords / limit)
            }
        });
    } catch (error) {
        return res.status(500).send({ 
            _status: false,
             _message: 'Unable to fetch orders.', 
             _data: [], 
             _error: error.message
             });
    }
};

exports.details = async (req, res) => {
    try {
        const order = await orderModel.findOne({ _id: req.params.id, deleted_at: null });
        if (!order) return res.status(404).send({
             _status: false, 
             _message: 'Order not found.', 
             _data: null 
            });

        return res.send({ 
            _status: true, 
            _message: 'Order details fetched successfully.',
             _data: order 
            });

    } catch (error) {
        return res.status(500).send({ 
            _status: false, 
            _message: 'Unable to fetch order details.', 
            _data: null, 
            _error: error.message 
        });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const orderStatus = Number(req.body.order_status);
        if (!ORDER_STATUSES[orderStatus]) {
            return res.status(422).send({
                 _status: false, 
                 _message: 'Invalid order status.', 
                 _data: null 
                });
        }

        const order = await orderModel.findOne({ _id: req.params.id, deleted_at: null });
        
        if (!order) return res.status(404).send({
             _status: false, 
             _message: 'Order not found.', 
             _data: null 
            });

        if (Number(order.order_status) === orderStatus) {
            return res.send({
                _status: true,
                _message: 'Order status is already up to date.',
                _email_sent: false,
                _data: order
            });
        }

        order.order_status = orderStatus;
        order.updated_at = new Date();
        await order.save();

        let emailSent = false;
        try {
            await sendOrderStatusEmail(order, ORDER_STATUSES[orderStatus]);
            emailSent = true;
        } catch (emailError) {
            // Status change should not fail because the email service is temporarily unavailable.
            console.error(`Order status email failed for ${order.order_number}:`, emailError.message);
        }

        return res.send({
            _status: true,
            _message: emailSent ? 'Order status updated and customer notified.' : 'Order status updated successfully.',
            _email_sent: emailSent,
            _data: order
        });
    } catch (error) {
        return res.status(500).send({ 
            _status: false, 
            _message: 'Unable to update order status.', 
            _data: null, 
            _error: error.message 
        });
    }
};

exports.destroy = async (req, res) => {
    try {
        const ids = Array.isArray(req.body.ids) ? req.body.ids : [req.body.ids];

        const validIds = ids.filter(Boolean);

        if (!validIds.length) return res.status(422).send({ 
            _status: false, 
            _message: 'Select at least one order.', 
            _data: null 
        });

        const result = await orderModel.updateMany({ _id: { $in: validIds }, deleted_at: null }, { $set: { deleted_at: new Date(), update_at: new Date() } });

        return res.send({ 
            _status: true, 
            _message: 'Selected orders deleted successfully.', 
            _data: result 
        });
    } catch (error) {
        return res.status(500).send({ 
            _status: false, 
            _message: 'Unable to delete orders.', 
            _data: null, 
            _error: error.message 
        });
    }
};

const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const sendOrderStatusEmail = async (order, statusLabel) => {
    const recipient = order?.billing_address?.email || order?.shipping_address?.email;
    const sender = process.env.MAIL_FROM || process.env.gmail_email;

    if (!recipient) throw new Error('Customer email is missing for this order');
    if (!sender || !process.env.gmail_app_password) throw new Error('Email service is not configured');

    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE || 'gmail',
        auth: { user: process.env.gmail_email, pass: process.env.gmail_app_password },
    });

    return transporter.sendMail({
        from: sender,
        to: recipient,
        subject: `Order update - ${order.order_number}`,
        html: `<h2>Your order status has been updated</h2><p>Order number: <strong>${escapeHtml(order.order_number)}</strong></p><p>New status: <strong>${escapeHtml(statusLabel)}</strong></p><p>Thank you for shopping with us.</p>`,
    });
};
