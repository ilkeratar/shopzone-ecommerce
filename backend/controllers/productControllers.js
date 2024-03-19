import Product from "../modules/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import APIFilters from "../utils/apiFilters.js";

export const getProducts = catchAsyncErrors(async (req, res) => {
        const resPerPage= 4;
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

export const getProduct = catchAsyncErrors(async (req, res, next) => {
        const product = await Product.findById(req?.params?.id);

        if (!product)
            return next(new ErrorHandler("Product not found",404));

        res.status(200).json({product});

});

export const createProduct = catchAsyncErrors(async (req, res) => {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({product});
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
        let product = await Product.findById(req?.params?.id);
        if (!product)
            return next(new ErrorHandler("Product not found",404));

        product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {new: true});

        res.status(200).json({product});

});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
        let product = await Product.findById(req?.params?.id);
        if (!product)
            return next(new ErrorHandler("Product not found",404));

        await product.deleteOne(product);
        res.status(200).json({message: "Product Deleted."});

});