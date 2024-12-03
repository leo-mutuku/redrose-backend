"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Maintain proper stack trace for where the error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
