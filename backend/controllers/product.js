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

// Create a review or if user has given it then update it
exports.createProductReview = catchAsyncHandler(async (req, res, next) => {
    let { rating, comment, productId } = req.body;
    rating = Number(rating)
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const givenReview = await Product.findOne(
        {
            _id: productId,
            reviews: { $elemMatch: { user: req.user._id } }
        })
        .populate('reviews')
        .select('-images -name -description -price -category -stock -user -createdAt -updatedAt')

    let product;
    if (!givenReview) {
        product = await Product.findOneAndUpdate({ _id: productId }, {
            $push: { reviews: review },
            $inc: { numOfReviews: 1 },
        }, {
            new: true,
            useFindAndModify: false
        })
    }
    else {
        product = await Product.updateOne({
            _id: productId,
            reviews: { $elemMatch: { user: req.user._id } }
        }, {
            $set: { 'reviews.$': review },
        }, {
            new: true,
            useFindAndModify: false
        })
    }

    product = await Product.findByIdAndUpdate({ _id: productId }, [{
        $set: { ratings: { $avg: '$reviews.rating' } }
    }])

    return res.status(200).json({
        success: true,
    })
})

// Get all reviews of a product - product through query
exports.getProductReviews = catchAsyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    return res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})

// user can delete only his own review
exports.deleteProductReview = catchAsyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    // delete review - learn (in findOne method, not need to use $elemMatch )
    product = await Product.findOneAndUpdate({ _id: req.query.productId }, {
        $pull: { reviews: { user: req.user._id } },
        $inc: { numOfReviews: -1 },
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    product = await Product.findByIdAndUpdate({ _id: req.query.productId }, [{
        $set: { ratings: { $avg: '$reviews.rating' } }
    }])

    return res.status(200).json({
        success: true,
    })
})