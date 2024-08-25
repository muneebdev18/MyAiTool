import mongoose from "mongoose";
// import DATABASE from '../utils/contants.js'
import contants from "../utils/constants.js";
const {DATABASE} = contants
const database = () => {
    try {
        mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 });
        console.log(DATABASE.SUCCESS);
    } catch (error) {
        logger.error(error.message);
        console.log(DATABASE.FAIL, error);
    }
}
export default database;