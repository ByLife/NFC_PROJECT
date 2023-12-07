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
const User_1 = __importDefault(require("../../database/models/User"));
const logger_1 = __importDefault(require("../../logger"));
const Product_1 = __importDefault(require("../../database/models/Product"));
exports.default = {
    name: "/product/claim",
    description: "Claim a product",
    method: "GET",
    run: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.query)
                return res.send({ error: "No Query" });
            const token = req.query['token'];
            const uid = req.query['uid'];
            const serialNumber = req.query['serialNumber'];
            logger_1.default.debug(token);
            if (typeof token !== "string")
                return res.send({ error: "Token need to be a string" });
            if (typeof uid != "string")
                return res.send({ error: "Token need to be a string" });
            if (typeof serialNumber != "string")
                return res.send({ error: "Token need to be a string" });
            if (uid.length <= 0)
                return res.send({ error: "UID invalid" });
            if (serialNumber.length < 5)
                return res.send({ error: "Serial Number invalid" });
            if (token.length < 14)
                return res.send({ error: "Token invalid" });
            const user = yield User_1.default.findOne({ token: token });
            if (!user)
                return res.send({ error: "No user found with this Token" });
            const product = yield Product_1.default.findOne({ uid: uid, serial_id: serialNumber });
            if (!product)
                return res.send({ error: "No product found with this UID and Serial Number" });
            if (product.actualOwner != null)
                return res.send({ error: "The product has already an owner" });
            logger_1.default.debug(user);
            product.actualOwner = user;
            yield product.save();
            return res.send({ info: "Product has been successfully claimed by the user", data: { product, user } });
        }
        catch (err) {
            logger_1.default.error(`Login error: ${err}`);
            res.status(400).send("An error occurred");
        }
    })
};
