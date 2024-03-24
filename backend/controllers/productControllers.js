import Product from "../modules/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import APIFilters from "../utils/apiFilters.js";

//Get Products => /api/products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 4;
    const apiFilters = new APIFilters(Product, req.query).search().filters();

    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products
    });
});

//Get Product => /api/products/:id
export const getProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id);

    if (!product)
        return next(new ErrorHandler("Product not found", 404));

    res.status(200).json({product});

});

//Create Product => /api/admin/products
export const createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user._id;
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({product});
});

//Update product => /api/admin/products/:id
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req?.params?.id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {new: true});

    res.status(200).json({product});

});

//Delete product => /api/admin/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));

    await product.deleteOne();
    res.status(200).json({message: "Product Deleted."});

});

//Create/Update review => /api/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
    const {rating, comment, productId} = req.body;
    const review = {
        user: req?.user?._id,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) return next(new ErrorHandler("Product not found", 404));

    const isReviewed = product?.reviews?.find(
        (r) => r.user.toString() === req?.user?._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review?.user?.toString() === req?.user?._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
    });
});

//Get product reviews => /api/reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    res.status(200).json({
        reviews: product.reviews,
    })
});

//Delete review => /api/admin/reviews
export const deleteProductReview = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.query.productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    const reviews = product?.reviews?.filter(
        (review) => review._id.toString() !== req?.query?.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
        numOfReviews === 0 ? 0 :
        reviews.reduce((acc, item) => item.rating + acc, 0) /
        numOfReviews;

    product = await Product.findByIdAndUpdate(
        req.query.productId,
        {reviews, numOfReviews, ratings},
        {new: true} );

    res.status(200).json({
        success: true,
        product
    });
});