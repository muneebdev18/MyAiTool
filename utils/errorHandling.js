import sendResponse from './sendResponse.js';
import constants from './constants.js'
const {STATUS_CODES} = constants


const errorHandling = (error, res, req) => {
    // logger.error(error.message + " : " + req?.originalUrl);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(sendResponse(false, error.message));
}

export default errorHandling;