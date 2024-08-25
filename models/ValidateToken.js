import mongoose from 'mongoose';

const validateTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: [{
        type: String,
        required: false
    }],
}, { timestamps: true });

export default mongoose.model('token', validateTokenSchema);