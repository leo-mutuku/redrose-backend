"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const routers = express_1.default.Router();
// Add your routes here - above the module.exports line
routers.use("/products", productRoutes_1.default);
exports.default = routers;
