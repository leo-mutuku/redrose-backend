"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = require("../utils/AppError"); // Adjust the path to your AppError file
const Logger_1 = __importDefault(require("../utils/Logger"));
const globalErrorHandler = (err, req, res, next) => {
    // Handle known operational errors
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    // Log unexpected errors to a file
    Logger_1.default.error({
        message: err.message || "Unknown Error",
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        query: req.query,
    });
    // For development or debugging purposes, log unexpected errors to the console
    console.error("Unexpected error:", err); // Log for debugging purposes
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
exports.globalErrorHandler = globalErrorHandler;
