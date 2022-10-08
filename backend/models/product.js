const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Product name required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Product description required"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Product price required"],
        maxLength: [7, "Max 7 digit price"]
    },
    rating: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"]
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
        maxLength: [4, "Stock can not exceed 4 characters"]
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: [true]
            },
            rarting: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema);