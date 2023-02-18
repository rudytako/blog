import mongoose, { mongo } from "mongoose";
import { IUser } from "../config/interface";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add your name"],
        trim: true,
        maxLength: [20, 'Name must be up to 20 characters']
    },
    account: {
        type: String,
        required: [true, 'Please enter your email or phone number'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        trim: true
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
    },
    role: {
        type: String,
        default: 'user' // or admin
    },
    type: {
        type: String,
        default: 'register'
    }
}, {
    timestamps: true
})

export default mongoose.model<IUser>('user', userSchema);