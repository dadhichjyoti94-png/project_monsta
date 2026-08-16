const orderModel = require('../../modles/order');

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

        const order = await orderModel.findOneAndUpdate(
            { _id: req.params.id, deleted_at: null },
            { $set: { order_status: orderStatus, update_at: new Date() } },
            { new: true }
        );
        
        if (!order) return res.status(404).send({
             _status: false, 
             _message: 'Order not found.', 
             _data: null 
            });

        return res.send({ 
            _status: true,
            _message: 'Order status updated successfully.', 
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