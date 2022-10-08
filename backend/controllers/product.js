const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncHandler = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/ApiFeatures");


/*
    @CREATE A PRODUCT -- ADMIN
*/
exports.createProduct = catchAsyncHandler(async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body)
    return res.status(201).json({
        success: true,
        product
    })
})

exports.getAllProducts = catchAsyncHandler(async (req, res) => {

    const resultPerPage = 5;

    const apiFeature = new ApiFeatures(Product.find(), req.query);
    const products = await apiFeature
        .search()
        .filter()
        .pagination(resultPerPage)
        .query;

    return res.status(200).json({
        success: true,
        products
    })
})

// UPDATE A PRODUCT -- ADMIN
exports.updateProduct = catchAsyncHandler(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    return res.status(200).json({
        success: true,
        product
    })
})

exports.getProductDetails = catchAsyncHandler(async (req, res, next) => {
    const product = await Product.findById({ _id: req.params.id });
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    return res.status(200).json({
        success: true,
        product
    })
})

// DELETE A PRODUCT -- ADMIN
exports.deleteProduct = catchAsyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    } await product.remove();

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})