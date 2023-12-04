import mongoose, {Document, Schema} from "mongoose";
import  { UserDocument } from "./User";

export interface Product {
    serial_id: number;
    
    price: number;
    productName: string;

    previousOwners: Array<UserDocument>
    actualOwner: UserDocument
}

export interface ProductDocument extends Product, Document {}

const ProductSchema = new Schema({
    serial_id: {type: String, required: true, unique: true},
    
    price: {type: Number, required: true, unique: false},
    productName: {type: String, required: true, unique: false},

    previousOwners: {type: Array<Object>, required: true, unique: false},
    actualOwner: {type: Object, required: true}
});

export default mongoose.model<ProductDocument>("Product", ProductSchema);