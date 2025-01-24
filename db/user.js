import mongoose from 'mongoose';

const userDetailSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true },
        email: { type: String, unique: true },
        password:{ String, required: true },
        createdAt: { type: Date, default: Date.now },
        updateAt : { type: Date, default: Date.now },
    },
    {
        collection: "UserInfo"
    }
);

const userModel = mongoose.model("UserInfo", userDetailSchema);

export { userModel as User };
