"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    var _a;
    // Skip JWT verification for auth routes
    if (req.path.startsWith("/auth")) {
        return next();
    }
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Expected format: "Bearer <token>"
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    try {
        const secretKey = process.env.JWT_SECRET || "your-default-secret";
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.user = decoded; // Attach the decoded payload to the request object
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token." });
    }
};
exports.default = verifyJWT;
