"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler"); // Adjust path
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT || 9000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});
app.use("/api/v1", routes_1.default);
// Error handling middleware (should be after all other middlewares and routes)
app.use(globalErrorHandler_1.globalErrorHandler);
app.listen(PORT, () => {
    console.log("Listening to: ", PORT);
});
