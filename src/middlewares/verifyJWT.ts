import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Auth } from "../entities/administration/Auth";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    // Skip JWT verification for auth routes

    console.log("Received request path:", req.path);
    if (req.path.startsWith("/auth") || req.path.startsWith("/posterminal") || req.path.startsWith("/validatewaiter") || req.path.startsWith("/posterminalprintbill") || req.path.startsWith("/sales")) {
        return next();
    }

    const token = req.headers.authorization?.split(" ")[1]; // Expected format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {

        const secretKey = process.env.JWT_SECRET || "your-default-secret";
        const decoded = jwt.verify(token, secretKey);
        req.body.user = decoded

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token." });
    }
};

export default verifyJWT;
