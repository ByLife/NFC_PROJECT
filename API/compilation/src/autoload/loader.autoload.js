"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autoload = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../logger"));
const connect_database_1 = __importDefault(require("../database/connect.database"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../../config");
const path_1 = __importDefault(require("path"));
const socket_struct_autoload_1 = require("./socket_struct.autoload");
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
class Autoload {
    constructor() {
        Autoload.port = Number(process.env.APP_PORT) || 3000;
        //Autoload.app.use(Autoload.rateLimiter)
        Autoload.start();
        logger_1.default.success("Server started on port " + Autoload.port);
    }
    // Rate limiter methods
    static isRateLimited(socketId) {
        const record = Autoload.clients.get(socketId);
        if (!record)
            return false;
        return record.requests > Autoload.rateLimitThreshold;
    }
    static rateLimiterMiddleware(socket, handler) {
        const socketId = socket.id;
        if (!Autoload.clients.has(socketId)) {
            Autoload.clients.set(socketId, { requests: 0, timer: null });
        }
        const record = Autoload.clients.get(socketId);
        record.requests += 1;
        if (record.requests > Autoload.rateLimitThreshold && !record.timer) {
            // Set the timer only once when the threshold is exceeded
            record.timer = setTimeout(() => {
                record.requests = 0; // reset the request count
                clearTimeout(record.timer); // clear the timer
                record.timer = null; // reset the timer
            }, Autoload.rateLimitDuration);
        }
        if (record.requests > Autoload.rateLimitThreshold) {
            logger_1.default.warn(`Requests from socket ${socketId} are currently blocked due to rate limit.`);
            return; // Just return without processing the request
        }
        handler();
    }
    static autoloadRoutesFromDirectory(directory) {
        const httpMethods = ["get", "post", "put", "delete", "patch", "head", "options"];
        const files = fs_1.default.readdirSync(directory);
        for (const file of files) {
            const fullPath = path_1.default.join(directory, file);
            if (fs_1.default.statSync(fullPath).isDirectory()) {
                Autoload.autoloadRoutesFromDirectory(fullPath);
            }
            else if (file.endsWith('.ts')) {
                const route = require(fullPath).default;
                if (route && typeof route.run === 'function' && route.method && route.name) {
                    const httpMethod = route.method.toLowerCase();
                    if (httpMethods.includes(httpMethod)) {
                        Autoload.app[httpMethod](`/api${route.name}`, route.run);
                        logger_1.default.info(`Loaded route ${route.method} /api${route.name}`);
                    }
                    else {
                        logger_1.default.warn(`Unknown HTTP method: ${route.method}`);
                    }
                }
            }
        }
    }
    static autoloadFilesFromDirectory(directory) {
        const handlers = [];
        const files = fs_1.default.readdirSync(directory);
        for (const file of files) {
            const fullPath = path_1.default.join(directory, file);
            if (fs_1.default.statSync(fullPath).isDirectory()) {
                handlers.push(...Autoload.autoloadFilesFromDirectory(fullPath));
            }
            else if (file.endsWith('.ts')) {
                const handler = require(fullPath).default;
                handlers.push(handler);
            }
        }
        return handlers;
    }
    static attachHandlersToSocket(socket) {
        const handlers = Autoload.autoloadFilesFromDirectory(path_1.default.join(__dirname, '../socket'));
        logger_1.default.info(`Loading ${handlers.length} socket handlers...`);
        for (const handler of handlers) {
            logger_1.default.info(`Loading socket handler ${handler.name}...`);
            if (handler.name && typeof handler.run === 'function') {
                socket.on(handler.name, (message) => {
                    Autoload.rateLimiterMiddleware(socket, () => {
                        handler.run((0, socket_struct_autoload_1.redefineSocket)(socket), message);
                    });
                });
            }
        }
    }
    static rules() {
        Autoload.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Content-Type', 'application/json');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
                return res.status(200).json({});
            }
            next();
        });
    }
    static start() {
        logger_1.default.beautifulSpace();
        logger_1.default.info("Starting server...");
        (0, connect_database_1.default)().then(() => {
            Autoload.rules();
            Autoload.app.use(express_1.default.json()); // This is the middleware that parses the body of the request to JSON format
            Autoload.autoloadRoutesFromDirectory(path_1.default.join(__dirname, '../http'));
            Autoload.app.listen(Autoload.port, () => {
                logger_1.default.success(`Server started on port ${Autoload.port}`);
            });
            // Autoload.socket.on("connection", function (socket: Socket.Socket) {
            //     const newSocket = redefineSocket(socket);
            //     socket.on("conn", async (data: string) => {
            //         console.log(data)
            //         if(!data) return socket.emit("conn", "Please provide a token")
            //         const user = await User.findOne({token: data})
            //         console.log(user)
            //         if(!user) return socket.emit("conn", "Invalid token")
            //         newSocket.storage.user = user
            //         newSocket.storage.logged = true
            //         socket.emit("conn", "Connected to the server")
            //         Autoload.attachHandlersToSocket(newSocket);
            //     })  
            //     socket.on("disconnect", () => {
            //         Logger.warn(`Socket ${socket.id} disconnected.`);
            //         socket.disconnect(true)
            //     });
            // });
            logger_1.default.beautifulSpace();
            Autoload.logInfo();
            logger_1.default.beautifulSpace();
        });
    }
    static stop() {
        //Autoload.socket.close()
    }
}
exports.Autoload = Autoload;
Autoload.app = (0, express_1.default)();
//static socket: Socket.Server = new Socket.Server(process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 3001);
Autoload.port = process.env.HTTP_PORT ? Number(process.env.APP_PORT) : 3000;
Autoload.baseDir = path_1.default.resolve(__dirname, "../socket");
Autoload.rateLimitThreshold = 10000; // 10 000 Events par seconde
Autoload.rateLimitDuration = 10000; // 1 seconde
Autoload.clients = new Map();
Autoload.logInfo = () => {
    // ${config.application.description}
    logger_1.default.normal(`
        ${config_1.config.ascii.art}

        Version: ${config_1.config.api.version}
        Port: ${Number(process.env.APP_PORT) || 3000}
        `);
    // Owners: ${config.application.owners.join(", ")}
};
