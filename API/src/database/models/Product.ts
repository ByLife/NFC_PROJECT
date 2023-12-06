import mongoose, {Document, Schema} from "mongoose";
import  User, { UserDocument } from "./User";

export interface Product {
    serial_id: number;
    uid: number; 
    price: number;
    productName: string;

    previousOwners: Array<Object>
    actualOwner: Object
}

export interface ProductDocument extends Product, Document {}

const ProductSchema = new Schema({
    serial_id: {type: String, required: true, unique: true},
    uid: {type: String, require: true},
    
    price: {type: Number, required: true, unique: false},
    productName: {type: String, required: true, unique: false},

    previousOwners: [{ type: Object }],
    actualOwner: { type: Object, required: false, default: null }
});

export default mongoose.model<ProductDocument>("Product", ProductSchema);

