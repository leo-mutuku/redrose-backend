import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError"; // Adjust the path to your AppError file
import logger from "../utils/Logger";

export const globalErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    // Handle known operational errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }


    // Log unexpected errors to a file
    logger.error({
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
