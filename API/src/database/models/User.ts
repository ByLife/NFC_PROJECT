import mongoose, {Document, Schema} from "mongoose";

export interface User {
    user_id: string; // the user id is a unique name that is used to identify the user
    token: string;

    firstName: string; // the username is the name that is displayed to the user
    lastName: string;
    password: string; // the password is the password that is used to login
    phone_number: number;

    created_at: Date;
    role: number;
}

export interface UserDocument extends User, Document {}

const UserSchema = new Schema({
    user_id: {type: String, required: true, unique: true},
    token: {type: String, required: true},

    firstName: {type: String, required: true},
    lastName:{type: String, require: true},
    password: {type: String, required: true},
    phone_number: {type: Number, required: true},

    created_at: {type: Date, default: new Date().toLocaleDateString()},
    role: {type: Number, default: 0}
});

export default mongoose.model<UserDocument>("User", UserSchema);