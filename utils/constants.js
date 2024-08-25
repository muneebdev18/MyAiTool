// Database constants
const DATABASE = Object.freeze({
    SUCCESS: "Connected to Database Successfully",
    FAIL: "Could not Connected to DB...",
  });
// Status codes
const STATUS_CODES = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
});

export default {
  DATABASE,
  STATUS_CODES
}



