import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError"; // Adjust the path to your AppError file

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

    // Handle unknown or unhandled errors
    console.error("Unexpected error:", err); // Log for debugging purposes

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
