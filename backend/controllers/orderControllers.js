import Order from "../modules/order.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../modules/product.js";

// Create new order => /api/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.create({
        ...req.body,
        user: req.user._id,
    });

    res.status(200).json({
        order,
    })
});

//Get current user orders => /api/me/orders
export const getMyOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await  Order.find({user: req.user._id});

    res.status(200).json({
        orders,
    })
})

//Get order details => /api/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await  Order.findById(req.params.id).populate("user", "name email");
    if(!order) return next(new ErrorHandler("No Order found with this ID", 404));

    res.status(200).json({
        order,
    })
});

//Get all orders - ADMIN => /api/admin/orders
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await  Order.find();

    res.status(200).json({
        orders,
    })
});

//Update order - ADMIN => /api/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await  Order.findById(req.params.id);
    if(!order) return next(new ErrorHandler("No Order found with this ID", 404));
    if(order?.orderStatus === "Delivered") return next(new ErrorHandler("You have already delivered this order", 400));

    //Update products stock
    order?.orderItems?.forEach(async (item) => {
        const product = await Product.findById(item?.product?.toString());
        if(!product) next(new ErrorHandler("No Product found with this ID", 404));

        product.stock = product.stock - item.quantity;
        await product.save({ validateBeforeSave: false});
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    res.status(200).json({
        success: true,
    })
});

//Delete order - Admın => /api/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req?.params?.id);
    if (!order)
        return next(new ErrorHandler("Order not found",404));

    await order.deleteOne();
    res.status(200).json({message: "Order Deleted."});
})