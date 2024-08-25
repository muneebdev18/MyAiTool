import isEmpty from '../utils/isEmpty.js';
import constants from '../utils/constants.js';
import sendResponse from '../utils/sendResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

const { SUCCESS, NOT_FOUND, CREATED, BAD_REQUEST } = constants.STATUS_CODES;

// ---------- Register Api---------

export const registerHandler = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!isEmpty(req.body)) {
    return res.status(BAD_REQUEST).send(sendResponse(false, 'Please Fill All The Fields...'));
  }
  // check email and password validation
  if (await User.isEmailValid(email)) {
    return res.status(BAD_REQUEST).send(sendResponse(false, 'Invalid Email Format'));
  }
  // Validate password
  if (await User.isPasswordValid(password)) {
    if (password.length < 8) {
      return res.status(BAD_REQUEST).send(sendResponse(false, 'Password Length Must be 8 or more'));
    }
    return res.status(BAD_REQUEST).send(sendResponse(false, 'Invalid password format'));
  }
  // Find the user by email
  const user = await User.findOne({ email: email }).select('+password');

  // if user is found
  if (user) {
    return res.status(BAD_REQUEST).send(sendResponse(false, 'User already exists with this email'));
  }

  // password hashing
  const salt = await bcryptjs.genSalt(Number(process.env.SALT)); // use number
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Create new user
  const newUser = await User.create({
    fullname: fullname,
    email: email,
    password: hashedPassword,
  });
  res.status(CREATED).send(sendResponse(true, 'User Created Successfully', newUser));
});
// ---------- Login Api---------
export const loginHandler = asyncHandler(async (req, res) => {
  if (!isEmpty(req.body)) {
    return res.status(BAD_REQUEST).send(sendResponse(false, 'Fill all the fields'));
  }
  const { email, password } = req.body;
  // check email validation
  if (await User.isEmailValid(email)) {
    return res.status(BAD_REQUEST).send(sendResponse(false, 'Invalid Email Format'));
  }

  // find a user by email
  let user = await User.findOne({ email: email });

  // if user is not found OR user is Deleted
  if (!user || user.isDeleted) {
    return res.status(NOT_FOUND).send(sendResponse(false, 'No Account With this email has been registered'));
  }
  // compare the password with the database saved user
  if (!(await user.isPasswordMatch(password))) return res.status(BAD_REQUEST).send(sendResponse(false, 'Invalid Password'));

  // generate jwt token
  let token = await user.generateAccessToken();
  console.log('token', token);

  const userData = await User.findById(user._id).select('-password');
  const data = { userData, token };
  res.status(SUCCESS).send(sendResponse(true, 'User Successfully LoggedIn', data));
});

// ---------- Social Login API -----------

export const googleSocialLoginHandler = asyncHandler(async(req,res)=>{
if(!isEmpty(req.body)){
  return res.status(BAD_REQUEST).send(sendResponse(false,"Please Fill all the fields..."))
}
const { displayName, email, photoURL } = req.body; // these parameters are recived by the google

const user = await User.findOne({email:email})

if(!user){
  const newUser = await User.create({
    fullname:displayName,
    email:email,
    profile:photoURL,
    verified: true,
  })
  let token = await user.generateAccessToken()
  let data = {userData:newUser,token}

  res.status(CREATED).send(sendResponse(true, "Register With Google", data));
}
else{
  let token = await user.generateAccessToken()
  let data = { userData: user, token: token };
  res.status(SUCCESS).send(sendResponse(true,"Login Successfully With Google",data))
}
})

// ---------- User Profile Api-----------

export const userProfileApi = asyncHandler(async(req,res)=>{
const user = await User.findById({_id:req.user._id}).select("-password");
if(!user){
  return res.status(NOT_FOUND).send(sendResponse(false, "User Not Found"))
}

res.status(SUCCESS).send(sendResponse(true,"User Profile",user))
})

export const googleProfileUser = asyncHandler(async(req,res)=>{
  const {googleId} = req.params
  console.log("googleid params",googleId);
  const user = await User.findOne({googleId:googleId}).select("-password");
if(!user){
  return res.status(NOT_FOUND).send(sendResponse(false, "User Not Found"))
}

res.status(SUCCESS).send(sendResponse(true,"User Profile",user))
})