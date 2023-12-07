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
const utils_1 = __importDefault(require("../../../utils"));
const logger_1 = __importDefault(require("../../../logger"));
exports.default = {
    name: "/user/auth/register",
    description: "Register a new user",
    method: "GET",
    run: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get the username and password from the request body
            const userError = "User credentials missing - ";
            if (!req.query)
                return res.send({ error: "No Get Queries" });
            const firstName = req.query['firstName'];
            const lastName = req.query['lastName'];
            const password = req.query['password'];
            const phone_number = req.query['phoneNumber'];
            if (typeof firstName !== 'string' || typeof lastName !== 'string')
                return res.send({ error: userError + "First and Last Name must be strings" });
            if (firstName.length <= 3 || lastName.length <= 3)
                return res.send({ error: "First and last name must be more than 3 characters" });
            if (typeof password !== 'string')
                return res.send({ error: userError + "Password must be a string" });
            if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password))
                return res.send({ error: "Password must be more than 8 characters, include an uppercase letter, and a special character" });
            if (typeof phone_number !== "string")
                return res.send({ error: userError + "Phone must be a string" });
            if (phone_number.length < 9 || phone_number.length > 13)
                return res.send({ error: userError + "Invalid phone number" });
            const findUser = yield User_1.default.findOne({ phone_number: phone_number });
            if (findUser)
                return res.send({ error: userError + " User already exist" });
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
            const user = yield User_1.default.create({
                firstName,
                lastName,
                phone_number,
                password: hashedPassword,
                user_id: utils_1.default.GENERATE.USER.default.ID,
                token: utils_1.default.GENERATE.USER.default.TOKEN,
            });
            logger_1.default.info(`A user has been created under the name of ${firstName} ${lastName} and phone number ${phone_number}`);
            return res.send({
                info: "User created",
                data: user
            });
        }
        catch (err) {
            logger_1.default.error(err);
            res.status(400).send("An error occurred");
        }
    })
};
