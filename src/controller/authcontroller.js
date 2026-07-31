const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema } = require('../validations/authValidation');
const { loginSchema } = require('../validations/authValidation');
const logger = require('../config/logger');
const { sendVerificationEmail } = require('../services/emailService');

const registerUser = async (req, res) => {

  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            message: "validation failed",
            errors: validation.error.issues.map(e => e.message)
        });
    }

    const { username, email, password, department } = validation.data;

    const isUserAlreadyExsist = await userModel.findOne({ $or: [{ username }, { email }] });

    if (isUserAlreadyExsist) {
      return res.status(409).json({ message: "user already exsist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      role: "employee",
      department,
      verificationcode: verificationCode,
      verificationcodeexpires: expiryTime,
    });

    const savedUser = await newUser.save();

    sendVerificationEmail(email, verificationCode).catch(err => {
      logger.error(`Failed to send verification email: ${err.message}`);
    });

    const userToReturn = savedUser.toObject();
    delete userToReturn.password;

    return res.status(201).json({
      message: "user created successfully, please check your email for the verification code",
      user: userToReturn,
    });
  } catch (err) {
    return res.status(500).json({ message: "internal server error", error: err.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            message: "validation failed",
            errors: validation.error.issues.map(e => e.message)
        });
    }

    const { username, email, password } = validation.data;

    if ((!username && !email) || !password) {
      return res.status(400).json({ message: "email/username and password are required" });
    }

    const user = await userModel.findOne({ $or: [{ username }, { email }] });
    console.log("User found:", user); // ye line temporarily add karo

    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "invalid credentials" });
    }

   const token = jwt.sign(
    { id: user._id, role: user.role, department: user.department },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
   );

   const cookieOptions = {
   httpOnly: true,
   secure: process.env.NODE_ENV === "production", // true only on HTTPS in production
   sameSite: "strict",
   maxAge: 60 * 60 * 1000, // 1 hour
  };
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "user login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "internal server error", error: err.message });
  }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "email and code are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "user already verified" });
        }

        if (user.verificationcode !== code) {
            return res.status(400).json({ message: "invalid verification code" });
        }

        if (user.verificationcodeexpires < Date.now()) {
            return res.status(400).json({ message: "verification code has expired" });
        }

        user.isVerified = true;
        user.verificationcode = undefined;
        user.verificationcodeexpires = undefined;
        await user.save();

        return res.status(200).json({ message: "email verified successfully" });
    } catch (err) {
        logger.error(`Error verifying email: ${err.message}`);
        return res.status(500).json({ message: "internal server error", error: err.message });
    }
};

module.exports = { registerUser , loginUser , verifyEmail};