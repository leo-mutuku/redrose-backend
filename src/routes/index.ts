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
import SMSRoutes from "./administration/SMSRoutes";


// import finance routes
import AccountsRoutes from "./finance/AccountsRoutes"
import BanksRoutes from "./finance/BankRoutes"
import CashAccountRoutes from "./finance/CashAccountRoutes"
import FundTransferRoutes from "./finance/FundTransferRoutes"
import MpesaTillRoutes from "./finance/MpesaTillRoutes"
import GLAccountRoutes from "./finance/GLAccountRoutes"


// store routes 
import UnitRoutes from "./store/UnitsRoutes"
import ItemcategoryRoutes from "./store/ItemCategoryRoutes"
import StoreRegisterRoutes from "./store/StoreregisterRoutes"
import ItemRegisterRoutes from "./store/ItemRegisterRoutes"
import StoreItemRoutes from "./store/StoreItemRoutes"
import StoreIssueRoutes from "./store/StoreIssueRoutes"


// ktchen
import MenuUnitRoutes from "./kitchen/MenuUnitRoutes"
import MenuCategory from "./kitchen/MenuCategoryRoutes"
import MenuRegister from "./kitchen/MenuRegisterRoutes"



// POS printer
//import POSPrinterRoutes from "./sales/PrintPos"


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
routers.use("/sms", SMSRoutes);


// finance routes
routers.use("/accounts", AccountsRoutes)
routers.use("/banks", BanksRoutes)
routers.use("/cashaccounts", CashAccountRoutes)
routers.use("/fundtransfers", FundTransferRoutes)
routers.use("/mpesatills", MpesaTillRoutes)
routers.use("/glaccounts", GLAccountRoutes)


//store routes
routers.use("/unit", UnitRoutes)
routers.use("/itemcategory", ItemcategoryRoutes)
routers.use("/storeregister", StoreRegisterRoutes)
routers.use("/itemregister", ItemRegisterRoutes)
routers.use("/storeitem", StoreItemRoutes)
routers.use("/storeissue", StoreIssueRoutes)


// ktchen
routers.use("/menuunit", MenuUnitRoutes)
routers.use("/menucategory", MenuCategory)
routers.use("/menuregister", MenuRegister)

// POS printer
//routers.use("/posprinter", POSPrinterRoutes)


export default routers;