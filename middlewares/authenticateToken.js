// In authenticateToken.js
import jwt from 'jsonwebtoken';
import ValidateToken from '../models/ValidateToken.js';
import User from '../models/user.model.js';
import sendResponse from '../utils/sendResponse.js';
// import logger from '../utils/logger.js';
import constant from '../utils/constants.js';
const { ROLES, STATUS_CODES } = constant;

const authenticateToken = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
            const user = await User.findById(decoded._id);
            let UserInTokenModel = await ValidateToken.findOne({ userId: user?._id, token: { $in: token } });
            if (UserInTokenModel) return res.status(STATUS_CODES.UNAUTHORIZED).send(sendResponse(false, "Token Expired"));
            
            if (!user) return res.status(STATUS_CODES.NOT_FOUND).send(sendResponse(false, "User not found"));
            if (user && user?.isDeleted) return res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, "Your Account has been deleted, Please Contact the administrator"));

            req.user = user;
            next();

        } catch (error) {
            // logger.error(error.message);
            res.status(STATUS_CODES.UNAUTHORIZED).send(sendResponse(false, error.message));
        }
    } else {
        res.status(STATUS_CODES.BAD_REQUEST).send(sendResponse(false, "Not Authorized, No Token"));
    }
};

export default authenticateToken;
