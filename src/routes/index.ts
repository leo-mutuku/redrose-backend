import express from "express";
import productRoutes from "./productRoutes";
import UserRoutes from "./administration/UsersRoutes";
const routers = express.Router();

// Add your routes here - above the module.exports line
routers.use("/products", productRoutes);
routers.use("/users", UserRoutes);

export default routers;