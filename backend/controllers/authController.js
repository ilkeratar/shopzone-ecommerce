import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../modules/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import assignToken from "../utils/assignToken.js";
import {getResetPasswordTemplate} from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

export const registerUser = catchAsyncErrors(async (req, res) => {
   const { name, email, password } = req.body;
   const user = await User.create({
       name,
       email,
       password
   });

    assignToken(user, 201, res);
});

export const loginUser = catchAsyncErrors(async (req, res, next)=> {
    const { email, password } = req.body;
    if(!email || !password) return next(new ErrorHandler("Please enter email & password"),400);

    const user = await User.findOne({ email }).select("+password");
    if(!user) return next(new ErrorHandler("Invalid email or password"),401);
    const isInvalid = await user.comparePassword(password);
    if(!isInvalid) return next(new ErrorHandler("Invalid email or password"),401);

    assignToken(user, 201, res);
})

export const logOut = catchAsyncErrors(async (req, res) => {
    res.cookie( "token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        message: "Logged Out"
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) return next(new ErrorHandler("User not found with this email", 404));

    //Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    //Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/api/password/reset/${resetToken}`;
    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopZone Password Recovery',
            message
        });

        res.status(200).json({
            message: `Email sent to: ${user.email}`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return next(new ErrorHandler(error.message, 500));
    }
});

export const resetPassword = catchAsyncErrors( async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
    });

    if(!user)
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400));

    if(req.body.password !== req.body.confirmPassword)
        return next(new ErrorHandler("Passwords does not match", 400))

    //Set the new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    assignToken(user, 200, res);
})




