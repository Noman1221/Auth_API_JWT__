import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/auth.model.js";

// User Registration
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || "Apex_VIP", { expiresIn: '1d' });
        res.status(201).json({ success: true, message: "Register Successful", data: { token, user: { id: newUser._id, email: newUser.email, name: newUser.name } } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// User Login
export const login = async (req, res) => {
    const { email, password } = req.body;



    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "Apex_VIP", { expiresIn: '1d' });
        res.status(200).json({ success: true, message: "Login Successful", data: { token, user: { id: user._id, email: user.email, name: user.name } } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// forget password
export const forgetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};  