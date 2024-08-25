// Model for send response
const sendResponse = (success, message, data) => {
    if (data != null) {
        return { success: success, message: message, data: data };
    } else {
        return { success: success, message: message };
    }
}

export default sendResponse;