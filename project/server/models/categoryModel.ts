import mongoose, { mongo } from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add your category'],
        trim: true,
        unique: true,
        maxLength: [50, 'Name must be up to 50 characters long']
    }
}, {
    timestamps: true
})

export default mongoose.model('category', categorySchema);