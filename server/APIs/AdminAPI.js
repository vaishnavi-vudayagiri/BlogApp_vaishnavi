import exp from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/UserModel.js'
export const adminApp = exp.Router()

// read all users n authors
adminApp.get("/users", async (req, res) => {
try {
const users = await UserModel.find(
{ role: { $in: ["USER", "AUTHOR"] } },
{ password: 0 });
res.status(200).json({message: "users",payload: users});
} catch (err) {
res.status(500).json({ message: err.message });
}
});


//BLOCK / ACTIVATE USER
adminApp.put("/user/:userId/status", async (req, res) => {
try {
const { userId } = req.params;
const { status } = req.body; 
// validate status
if(!["ACTIVE", "BLOCKED"].includes(status)) {
return res.status(400).json({ message: "Invalid status" });
}
const updatedUser = await UserModel.findByIdAndUpdate(userId,{status},{new:true});
if(!updatedUser) {
return res.status(404).json({ message: "User not found" });
}
res.status(200).json({message:"Status updated",payload: updatedUser});
} catch(err) {
res.status(500).json({message:err.message });
    }
});