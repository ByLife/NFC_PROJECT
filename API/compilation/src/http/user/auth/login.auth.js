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
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../../../database/models/User"));
const logger_1 = __importDefault(require("../../../logger"));
exports.default = {
    name: "/user/auth/login",
    description: "Login a user",
    method: "GET",
    run: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const phone_number = req.query['phoneNumber'];
            const password = req.query['password'];
            const userError = "Login credentials missing - ";
            if (typeof phone_number !== 'string' || phone_number.length < 9 || phone_number.length > 13)
                return res.send({ error: userError + "Invalid phone number" });
            if (typeof password !== 'string')
                return res.send({ error: userError + "Password must be a string" });
            const user = yield User_1.default.findOne({ phone_number: phone_number });
            if (!user) {
                return res.send({ error: userError + "User not found" });
            }
            const match = yield bcrypt_1.default.compare(password, user.password);
            if (!match)
                logger_1.default.warn(`Invalid login made for the user ${user.firstName} ${user.lastName} with the phone number ${user.phone_number}`);
            if (!match)
                return res.send({ error: "Invalid password" });
            logger_1.default.info(`User logged in under the name of ${user.firstName} and ${user.lastName} with phone number ${user.phone_number} and he is a ${user.role == 0 ? 'User' : 'Admin'}`);
            return res.send({ info: "User successfully logged in", data: user });
        }
        catch (err) {
            logger_1.default.error(`Login error: ${err}`);
            res.status(400).send("An error occurred");
        }
    })
};
