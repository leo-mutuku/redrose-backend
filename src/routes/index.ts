import express from "express";
import productRoutes from "./productRoutes";
import UserRoutes from "./administration/UsersRoutes";
import AuthRoutes from "./administration/AuthRoutes"
import verifyJWT from "../middlewares/verifyJWT";

const routers = express.Router();

// Use the JWT verification middleware for all routes
routers.use(verifyJWT);
routers.use("/products", productRoutes);
routers.use("/auth", AuthRoutes)
routers.use("/users", UserRoutes);


export default routers;