import { Router } from "express";
import {registerHandler,loginHandler,userProfileApi,googleProfileUser} from '../controllers/auth.controller.js'
import passport from 'passport';
import authenticateToken from "../middlewares/authenticateToken.js";
// import { profile } from "winston";
import User from "../models/user.model.js";

const router = Router();

router.post('/register',registerHandler)
router.post('/login',loginHandler)
router.get('/userProfile',authenticateToken,userProfileApi)
router.get('/googleLogin/:googleId',googleProfileUser)

export default router;