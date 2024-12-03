"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: "error",
    format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.errors({ stack: true }), winston_1.format.json()),
    transports: [
        new winston_1.transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to file
        new winston_1.transports.Console({ format: winston_1.format.simple() }), // Optionally log to console
    ],
});
exports.default = logger;
