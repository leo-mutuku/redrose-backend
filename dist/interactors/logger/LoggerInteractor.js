"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLogger = void 0;
const winston_1 = require("winston");
class WinstonLogger {
    constructor() {
        this.logger = (0, winston_1.createLogger)({
            level: "info",
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf((_a) => {
                var { timestamp, level, message } = _a, meta = __rest(_a, ["timestamp", "level", "message"]);
                return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
            })),
            transports: [
                new winston_1.transports.File({ filename: "logs/errors.log", level: "error" }),
                new winston_1.transports.File({ filename: "logs/combined.log" }),
                new winston_1.transports.Console(),
            ],
        });
    }
    error(message, meta) {
        this.logger.error(message, meta);
    }
    info(message, meta) {
        this.logger.info(message, meta);
    }
}
exports.WinstonLogger = WinstonLogger;
