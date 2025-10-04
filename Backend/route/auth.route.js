import express from 'express';
import { forgetPassword, login, register } from '../controller/auth.Controller.js';
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forget-password", forgetPassword);
export default authRouter;
