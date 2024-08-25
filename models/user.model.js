import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs';
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 40,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      sparse: true,
      set: (e) => e.toLowerCase(),
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      trim: true,
    },
    password: {
      type: String,
      validate: {
        validator: function (value) {
          // If googleId is not present, password must be provided
          return this.googleId || value;
        },
        message: 'Password is required unless logging in with Google',
      },
      trim: true,
      // select: false,
    },
    profile:{
      type: String,
    },
    googleId: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
// check if Email template is Valid
userSchema.statics.isEmailValid = async function (email) {
  if (email) {
    return !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }
};

// check if Password template is Valid
userSchema.statics.isPasswordValid = async function (password) {
  if (password) {
    return !password.match(/^(?=.*[A-Z])(?=.*[@#$!%*?&])(?=.{8,})/);
  }
};
// check if password is match with database

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcryptjs.compare(password, user.password);
};

userSchema.methods.generateAccessToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
  return token;
}
userSchema.methods.isPasswordMatch = async function (password) {
  return await bcryptjs.compare(password, this.password);  // this.password is the hashed password in the DB
};
const User = mongoose.model('User', userSchema);
export default User;
