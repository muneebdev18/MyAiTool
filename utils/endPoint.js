import sendResponse from './sendResponse.js';
import contants from "./constants.js";
const {STATUS_CODES} = contants

// Call if url is broken or invalid
const endPoint = (req, res) => {
    res.status(STATUS_CODES.NOT_FOUND).send(sendResponse(false, "Endpoint does not exist."));
}

export default endPoint;