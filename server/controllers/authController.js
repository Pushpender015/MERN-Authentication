import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE , PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

/*------- RESISTER CONTROLLER ---------*/
export const register = async (req , res) => {
    const {name , email , password} = req.body;

    // any feild are missing
    if(!name || !email || !password) {
        return res.json({
            success: false,
            message: 'Missing Details'
        });
    }

    // complete logic of register user
    try {

        const existingUser = await userModel.findOne({email});

        // if user already exists
        if(existingUser) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        // if not , then hashed password then save detials
        const hashedPassword = await bcrypt.hash(password , 10);

        const user = new userModel({
            name, email, password: hashedPassword
        });

        await user.save();

        // generate JWT 
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // ✔️ auto true on Vercel
          // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✔️ lax for local, none for vercel
          sameSite: "none", // ✔️ lax for local, none for vercel
          maxAge: 7 * 24 * 60 * 60 * 1000, // ✔️ 7 days
        });

        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to SWOT FICTION Academy',
            text: `     <p>Hey ${user.name} <br>
                        🌟 Congratulations! You're officially part of Swot Fiction Academy! 🌟
                        
                        Your journey to brilliance begins now.
                        Log in to your Swot Fiction account, dive into a world of imagination, and let your creativity shine.

                        ✨ The stage is set—now it's your time to sparkle. ✨

                        <b>Regards,</b>
                        <b>Pushpender Singh</b>
                         </p>
                        `
        }
        await transporter.sendMail(mailOptions);

        // finally 
        return res.json({
            success: true,
            message: 'Account has been registered',
            user
        });

    } 
    catch(error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

/*------- LOGIN CONTROLLER ---------*/
export const login = async (req , res) => {
    const {email , password} = req.body;

    // if any feild are missing
    if(!email || !password) {
        return res.json({
            success: false,
            message: 'Email and password are required'
        });
    }

    try {

        const user = await userModel.findOne({email});

        // if user not available
        if(!user) {
            return res.json({
                success: false,
                message: 'Invalid email'
            })
        }

        // if user available, then match password
        const isMatch = await bcrypt.compare(password , user.password);

        // if password doesn't match
        if(!isMatch) {
            return res.json({
                success: false,
                message: 'Invalid password'
            });
        }

        // generate JWT 
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // ✔️ auto true on Vercel
          // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✔️ lax for local, none for vercel
          sameSite: "none", // ✔️ lax for local, none for vercel
          maxAge: 7 * 24 * 60 * 60 * 1000, // ✔️ 7 days
        });
        // finally 
        return res.json({
            success: true,
            message: 'Account login successfully',
            user
        });

    }
    catch(error) {
        return res.json({
            success: false,
            message: error.message,
            user
        });
    }
}

/*------- LOGOUT CONTROLLER ---------*/
export const logout = async (req , res) => {
    try {
        res.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // 🔥 Must be true for prod
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          path: "/", // ✅ Important: Always clear on root path
        });

        return res.json({
            success: true,
            message: "Logged Out"
        });
    }
    catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}

/*------- SEND VERIFY OTP CONTROLLER ---------*/
export const sendVerifyOtp = async (req , res) => {
    try {
        const {userId} = req.body;  // mail id

        const user = await userModel.findById(userId);

        // if user already verified
        if(user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account Already verified"
            });
        }

        // if user node verified, then verify user with OTP
        const OTP = String(Math.floor(100000 + Math.random() * 90000));

        // then save the OTP in our database for verify ( after entering OTP by user )
        user.verifyOTP = OTP;

        // also set expiry time of OTP
        user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        // all save into DATABASE
        await user.save();

        // mail the OTP to 'user'
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
                subject: 'Verify Your Account via OTP',
                // text: `<h2>Confirm verification code</h2> <br>
                //         <p>Hey ${user.name} <br>
                //         Please enter the following code on the page where you dropped your login Credentials: <br> 
                //         <h1>${OTP}</h1> <br>
                //         This verification code will only be valid for the next <b>24 hours</b>.
                //         </p>
                //         `,
                html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}" , OTP).replace("{{email}}" , user.email)
        }
        await transporter.sendMail(mailOption);

        // finally send response
        res.json({
            success: true,
            message: 'OTP sent successfully on Email',
            user
        });

    }
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

/*------- VERIFY EMAIL via OTP CONTROLLER ---------*/
export const verifyEmail = async (req , res) => {
    
    const {userId , OTP} = req.body;

    // if userId & OTP not present
    if(!userId || !OTP) {
        return res.json({
            success: false,
            message: 'Something Went Wrong.'
        });
    }

    try {
        const user = await userModel.findById(userId);

        // if user doesn't exist
        if(!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        // enter invalid OTP
        if(user.verifyOTP === '' || user.verifyOTP !== OTP) {
            return res.json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // if OTP matches , but time expire
        if(user.verifyOTPExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: 'Sorry!, Your OTP has Expired.'
            });
        }

        // if OTP matches within time (user account verified )
        user.isAccountVerified = true;
        
        // then reset all things
        user.verifyOTP = '';
        user.verifyOTPExpireAt = 0;

        // then save all changes in DATABASE
        await user.save();

        // mail the OTP to 'user'
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
                subject: 'Your Account Verified Successfully.',
                text: `<h2>Account Verified</h2> <br>
                        <p>Hey ${user.name} <br>
                        your account has been successfully verified. <br>
                        Now you can access every lectures on our SWOT FICTION Academy.
                        </p> <br>
                        <b>Best Regards,</b>
                        <b>Pushpender Singh</b>
                        `
        }
        await transporter.sendMail(mailOption);

        // finally send response
        return res.json({
            success: true,
            message: 'Email verified successfully.',
            user
        });

    }
    catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

/*------- AUTHENTICATED OR NOT CONTROLLER ---------*/
export const isAuthenticated = async (req , res) => {
    try {
        return res.json({
            success: true
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

/*------- SEND 'PASSWORD RESET' OTP CONTROLLER ---------*/
export const sendPasswordResetOTP = async (req , res) => {
    const {email} = req.body;

    // if user not provided email
    if(!email) {
        return res.json({
            success: false,
            message: 'Email is required'
        });
    }

    // if email available
    try {

        const user = await userModel.findOne({email});

        // if user not available
        if(!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        // if available, then generate otp and send for forget pass.
        const OTP = String(Math.floor(100000 + Math.random() * 90000));

        // then save the OTP in our database for verify ( after entering OTP by user )
        user.resetOTP = OTP;

        // also set expiry time of OTP
        user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000; //15min

        // all save into DATABASE
        await user.save();

        // mail the OTP to 'user'
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
                subject: 'password Reset OTP',
                // text: `<h2>Confirm verification code</h2> <br>
                //         <p>Hey ${user.name} <br>
                //         Please enter the following code on the page where you dropped your login Credentials for reset your password: <br> 
                //         <h1>${OTP}</h1> <br>
                //         This verification code will only be valid for the next <b>15 minutes</b>.
                //         </p>
                //         `,
                html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}" , OTP).replace("{{email}}" , user.email)
        };
        await transporter.sendMail(mailOption);

        // finally send response
        res.json({
            success: true,
            message: 'OTP sent successfully on Email',
            user
        });

    }
    catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}

/*------- RESET USER PASSWORD CONTROLLER ---------*/
export const resetPassword = async (req , res) => {
    const {email , OTP , newPassword} = req.body;

    if(!email || !OTP || !newPassword) {
        return res.json({
            success: false,
            message: 'email, OTP, new password are required'
        });
    }

    try {

        const user = await userModel.findOne({email});
        // if user not available
        if(!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        // if OTP not match
        if(user.resetOTP === "" || user.resetOTP !== OTP) {
            return res.json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // if OTP match , but time limit exceed
        if(user.resetOTPExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: 'OTP Expired'
            });
        }

        // if OTP match within time, then "change password"
       
        // 1. hashed changed password
        const hashedPassword = await bcrypt.hash(newPassword , 10);

        // update new password on user database
        user.password = hashedPassword;
        user.resetOTP = '';
        user.resetOTPExpireAt = 0;

        // save all change in DB
        await user.save();

        // finally 
        return res.json({
            success: true,
            message: 'Password has been reset successfully',
            user
        })

    }
    catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}
