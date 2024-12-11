import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    // Skip JWT verification for auth routes
    if (req.path.startsWith("/auth") || req.path.startsWith("/posterminal") || req.path.startsWith("/posterminalprintbill") || req.path.startsWith("/sales")) {
        return next();
    }

    const token = req.headers.authorization?.split(" ")[1]; // Expected format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {

        const secretKey = process.env.JWT_SECRET || "your-default-secret";
        const decoded = jwt.verify(token, secretKey);
        (req as any).user = decoded; // Attach the decoded payload to the request object
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token." });
    }
};

export default verifyJWT;
