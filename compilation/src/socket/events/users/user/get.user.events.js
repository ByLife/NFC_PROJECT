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
exports.UserGetEvent = void 0;
const axios_1 = __importDefault(require("axios"));
const __1 = __importDefault(require("../../.."));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("../../../utils");
dotenv_1.default.config();
class UserGetEvent {
    constructor(socket) {
        this.socket = socket;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${process.env.BASE_URI}/api/v1/client/get/user/token`, utils_1.utils.set.bearer(__1.default.users[this.socket.id].token));
                __1.default.io.to(this.socket.id).emit("userGet", response.data.data);
            }
            catch (err) {
                console.log("Error resolving user" + err);
            }
        });
    }
}
exports.UserGetEvent = UserGetEvent;
