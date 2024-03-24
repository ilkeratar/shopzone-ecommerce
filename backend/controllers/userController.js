import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../modules/user.js";
import ErrorHandler from "../utils/errorHandler.js";

export const getCurrentUserProfile = catchAsyncErrors (async (req, res, next) => {
    const user = await User.findById(req?.user?._id);
    res.status(200).json({
        user,
    });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, { new: true });

    res.status(200).json({
        user,
    })
});

export const getUsers = catchAsyncErrors(async  (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        users,
    })
});

export const getUserDetails = catchAsyncErrors(async  (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
    res.status(200).json({
        user,
    })
});

export const updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, { new: true });

    res.status(200).json({
        user,
    })
});

export const deleteUser = catchAsyncErrors(async  (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))

    //TODO - Remove user avatar from cloudinary
    await user.deleteOne();

    res.status(200).json({
        success: true,
    })
});