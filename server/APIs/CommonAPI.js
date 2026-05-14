import exp from "express";
import { UserModel } from "../models/UserModel.js";
import { hash, compare } from "bcryptjs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

const { sign } = jwt;
export const commonApp = exp.Router();
config();

//REGISTER
commonApp.post("/users",upload.single("profileImageUrl"),
  async (req, res) => {
    let cloudinaryResult;
    try {
      const allowedRoles = ["USER", "AUTHOR"];
      const newUser = req.body;
      if (!allowedRoles.includes(newUser.role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      // Check existing user
      const existingUser = await UserModel.findOne({ email: newUser.email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      //Upload image if exists
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        newUser.profileImageUrl = cloudinaryResult.secure_url;
      }
      //Hash password
      newUser.password = await hash(newUser.password, 12);
      //Save user
      const newUserDoc = new UserModel(newUser);
      await newUserDoc.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      console.log("Registration error:", err);
      //rollback cloudinary upload
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }
      res.status(500).json({ message: err.message });
    }
  }
);


//LOGIN
commonApp.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const isMatched = await compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        profileImageUrl: user.profileImageUrl,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    let userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({
      message: "Login success",
      payload: userObj,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//LOGOUT 
commonApp.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logout success" });
});


//CHECK AUTH
commonApp.get("/check-auth",verifyToken("USER", "AUTHOR", "ADMIN"),(req, res) => {
    res.status(200).json({
      message: "authenticated",
      payload: req.user,
    });
  }
);


//CHANGE PASSWORD
commonApp.put("/password",verifyToken("USER", "AUTHOR", "ADMIN"),async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body
      if (currentPassword === newPassword) {
        return res.status(400).json({
          message: "New password cannot be same as current password",
        });
      }
      const user = await UserModel.findById(req.user.id);
      const isMatch = await compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Current password incorrect",
        });
      }
      user.password = await hash(newPassword, 10);
      await user.save();
      res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);