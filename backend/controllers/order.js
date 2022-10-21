const Order = require("../models/order");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncHandler = require("../middleware/catchAsyncError");
const Product = require("../models/product");


// Create new Order
exports.newOrder = catchAsyncHandler(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;


    if (!shippingInfo ||
        !orderItems ||
        !paymentInfo ||
        !itemsPrice ||
        !taxPrice ||
        !shippingPrice ||
        !totalPrice) {
        return next(new ErrorHandler(`Please fill all details to complete an order`), 400);
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        user: req.user._id,
        paymentInfo,
        paidAt: Date.now(),
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    })

    res.status(200).json({
        success: true,
        order,
    })
})


// Get single order of user by params
exports.getSingleOrder = catchAsyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId).populate('user', 'name email');
    if (!order) {
        return next(new ErrorHandler(`order with id ${req.params.orderId} not found`), 400)
    }
    return res.status(200).json({
        success: true,
        order
    })
})


// Get all orders of logged in users
exports.getMyOrders = catchAsyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })
    return res.status(200).json({
        success: true,
        orders
    })
})

// Get all orders -- Admin
exports.getAllOrders = catchAsyncHandler(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    totalAmount = orders.reduce((accumulator, order) => {
        return accumulator + order.totalPrice
    }, 0)
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// Update order stock & status --Admin
exports.updateOrder = catchAsyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId)

    if (!order) {
        return next(new ErrorHandler(`order with id ${req.params.orderId} not found`), 404)
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler(`order is already delivered`), 400)
    }

    order.orderItems.forEach(async (orderItem) => {
        await updateStock(orderItem.product, orderItem.quantity)
    })

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    })
})

async function updateStock(productId, quantity) {
    const product = await Product.findOneAndUpdate({ _id: productId }, {
        $inc: { stock: -quantity }
    }, {
        new: true,
        useFindAndModify: false
    })
}

// Delete an order --Admin
exports.deleteOrder = catchAsyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
        return next(new ErrorHandler(`order with id ${req.params.orderId} not found`), 404)
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler(`Delivered order can not be deleted`), 404)
    }
    await order.remove()

    res.status(200).json({
        success: true,
        message: "Order deleted successfully."
    })
})