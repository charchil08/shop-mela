const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteProductReview } = require("../controllers/product");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();


router.get("/products", getAllProducts);
router.post("/product/new", isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route("/product/:id")
    .get(isAuthenticatedUser, getProductDetails)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(authorizeRoles("admin"), deleteProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews")
    .get(getProductReviews)
    .delete(isAuthenticatedUser, deleteProductReview)

module.exports = router;