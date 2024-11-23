import express from "express";
import verifyJWT from "../middlewares/verifyJWT";

// import administration routes
import UserRoutes from "./administration/UsersRoutes";
import AuthRoutes from "./administration/AuthRoutes"
import RoleRoutes from "./administration/RoleRoutes";
import ShiftRoutes from "./administration/ShiftRoutes";
import SupplierRoutes from "./administration/SuppliersRoutes"
import UserRoleRoutes from "./administration/UserRoleRoutes"
import VendorRoutes from "./administration/VendorsRoutes";
import StaffRoutes from "./administration/StaffRoutes";


const routers = express.Router();
// Use the JWT verification middleware for all routes
routers.use(verifyJWT);
// Administration routes 
routers.use("/auth", AuthRoutes)
routers.use("/users", UserRoutes);
routers.use("/roles", RoleRoutes);
routers.use("/shifts", ShiftRoutes);
routers.use("/suppliers", SupplierRoutes);
routers.use("/userroles", UserRoleRoutes);
routers.use("/vendors", VendorRoutes);
routers.use("/staff", StaffRoutes);

export default routers;