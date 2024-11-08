import express from "express";
import productRoutes from "./productRoutes";
const routers = express.Router();

// Add your routes here - above the module.exports line
routers.use("/products", productRoutes);

export default routers;