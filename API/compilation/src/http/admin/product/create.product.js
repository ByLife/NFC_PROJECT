"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../../database/models/User"));
const logger_1 = __importDefault(require("../../../logger"));
const Product_1 = __importDefault(require("../../../database/models/Product"));
exports.default = {
    name: "/admin/product/create",
    description: "Create a product",
    method: "GET",
    run: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.query)
                return res.send({ error: "No Query" });
            // serial_id: {type: String, required: true, unique: true},
            // uid: {type: String, require: true},
            // price: {type: Number, required: true, unique: false},
            // productName: {type: String, required: true, unique: false},
            const token = req.query['token'];
            const serial_id = req.query['serialId'];
            const uid = req.query['uid'];
            const productName = req.query['productName'];
            const price = req.query['price'];
            if (typeof token !== "string")
                return res.send({ error: "Token need to be a string" });
            if (typeof serial_id !== "string")
                return res.send({ error: "SerialID need to be a string" });
            if (typeof uid !== "string")
                return res.send({ error: "UID need to be a string" });
            if (typeof productName !== "string")
                return res.send({ error: "Name need to be a string" });
            if (typeof price !== "string")
                return res.send({ error: "Price need to be a string" });
            if (token.length < 14)
                return res.send({ error: "Token invalid" });
            if (serial_id.length < 5)
                return res.send({ error: "Serial ID invalid" });
            if (uid.length < 1)
                return res.send({ error: "UID invalid" });
            if (productName.length < 3)
                return res.send({ error: "Product name invalid" });
            if (price.length < 1)
                return res.send({ error: "Price invalid" });
            const user = yield User_1.default.findOne({ token: token });
            if (!user)
                return res.send({ error: "No user found with this Token" });
            if (user.role != 1)
                res.send({ error: "User is not an admin" });
            logger_1.default.info(`Create product request for the user under the name of ${user.firstName} and ${user.lastName} with phone number ${user.phone_number} and he is a ${user.role == 0 ? 'User' : 'Admin'}`);
            const finalPrice = Number(price);
            if (typeof finalPrice != "number")
                return res.send("Invalid Price");
            yield Product_1.default.create({
                productName: productName,
                price: finalPrice,
                serial_id: serial_id,
                uid: uid
            });
            return res.send({ info: "User found", data: user });
        }
        catch (err) {
            logger_1.default.error(`Login error: ${err}`);
            res.status(400).send("An error occurred");
        }
    })
};
