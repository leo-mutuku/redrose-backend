import express from "express";
import UserRoutes from "./administration/UsersRoutes";
import AuthRoutes from "./administration/AuthRoutes"
import verifyJWT from "../middlewares/verifyJWT";

const routers = express.Router();

// Use the JWT verification middleware for all routes
routers.use(verifyJWT);

// Administration routes
routers.use("/auth", AuthRoutes)
routers.use("/users", UserRoutes);


export default routers;