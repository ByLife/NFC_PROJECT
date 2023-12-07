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
exports.default = {
    name: "/user/auth/get",
    description: "Get a user",
    method: "GET",
    run: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.query)
                return res.send({ error: "No Query" });
            const token = req.query['token'];
            if (typeof token !== "string")
                return res.send({ error: "Token need to be a string" });
            if (token.length < 14)
                return res.send({ error: "Token invalid" });
            const user = yield User_1.default.findOne({ token: token });
            if (!user)
                return res.send({ error: "No user found with this Token" });
            logger_1.default.info(`Get request for the user under the name of ${user.firstName} and ${user.lastName} with phone number ${user.phone_number} and he is a ${user.role == 0 ? 'User' : 'Admin'}`);
            return res.send({ info: "User found", data: user });
        }
        catch (err) {
            logger_1.default.error(`Login error: ${err}`);
            res.status(400).send("An error occurred");
        }
    })
};
