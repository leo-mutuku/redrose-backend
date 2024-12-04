"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyJWT_1 = __importDefault(require("../middlewares/verifyJWT"));
// import administration routes
const UsersRoutes_1 = __importDefault(require("./administration/UsersRoutes"));
const AuthRoutes_1 = __importDefault(require("./administration/AuthRoutes"));
const RoleRoutes_1 = __importDefault(require("./administration/RoleRoutes"));
const ShiftRoutes_1 = __importDefault(require("./administration/ShiftRoutes"));
const SuppliersRoutes_1 = __importDefault(require("./administration/SuppliersRoutes"));
const UserRoleRoutes_1 = __importDefault(require("./administration/UserRoleRoutes"));
const VendorsRoutes_1 = __importDefault(require("./administration/VendorsRoutes"));
const StaffRoutes_1 = __importDefault(require("./administration/StaffRoutes"));
const SMSRoutes_1 = __importDefault(require("./administration/SMSRoutes"));
// import finance routes
const AccountsRoutes_1 = __importDefault(require("./finance/AccountsRoutes"));
const BankRoutes_1 = __importDefault(require("./finance/BankRoutes"));
const CashAccountRoutes_1 = __importDefault(require("./finance/CashAccountRoutes"));
const FundTransferRoutes_1 = __importDefault(require("./finance/FundTransferRoutes"));
const MpesaTillRoutes_1 = __importDefault(require("./finance/MpesaTillRoutes"));
const GLAccountRoutes_1 = __importDefault(require("./finance/GLAccountRoutes"));
// store routes 
const UnitsRoutes_1 = __importDefault(require("./store/UnitsRoutes"));
const ItemCategoryRoutes_1 = __importDefault(require("./store/ItemCategoryRoutes"));
const StoreregisterRoutes_1 = __importDefault(require("./store/StoreregisterRoutes"));
const ItemRegisterRoutes_1 = __importDefault(require("./store/ItemRegisterRoutes"));
const StoreItemRoutes_1 = __importDefault(require("./store/StoreItemRoutes"));
const StoreIssueRoutes_1 = __importDefault(require("./store/StoreIssueRoutes"));
// ktchen
const MenuUnitRoutes_1 = __importDefault(require("./kitchen/MenuUnitRoutes"));
const MenuCategoryRoutes_1 = __importDefault(require("./kitchen/MenuCategoryRoutes"));
const MenuRegisterRoutes_1 = __importDefault(require("./kitchen/MenuRegisterRoutes"));
const MenuItemRoutes_1 = __importDefault(require("./kitchen/MenuItemRoutes"));
const KitchenStationRoutes_1 = __importDefault(require("./kitchen/KitchenStationRoutes"));
const KitchenSetupRoutes_1 = __importDefault(require("./kitchen/KitchenSetupRoutes"));
const FoodProcessingRoutes_1 = __importDefault(require("./kitchen/FoodProcessingRoutes"));
// sales routes
const CashierRegisterRoutes_1 = __importDefault(require("./sales/CashierRegisterRoutes"));
const VoidedBillRoutes_1 = __importDefault(require("./sales/VoidedBillRoutes"));
// POS printer
//import POSPrinterRoutes from "./sales/PrintPos"
const routers = express_1.default.Router();
// Use the JWT verification middleware for all routes
routers.use(verifyJWT_1.default);
// Administration routes 
routers.use("/auth", AuthRoutes_1.default);
routers.use("/users", UsersRoutes_1.default);
routers.use("/roles", RoleRoutes_1.default);
routers.use("/shifts", ShiftRoutes_1.default);
routers.use("/suppliers", SuppliersRoutes_1.default);
routers.use("/userroles", UserRoleRoutes_1.default);
routers.use("/vendors", VendorsRoutes_1.default);
routers.use("/staff", StaffRoutes_1.default);
routers.use("/sms", SMSRoutes_1.default);
// finance routes
routers.use("/accounts", AccountsRoutes_1.default);
routers.use("/banks", BankRoutes_1.default);
routers.use("/cashaccounts", CashAccountRoutes_1.default);
routers.use("/fundtransfers", FundTransferRoutes_1.default);
routers.use("/mpesatills", MpesaTillRoutes_1.default);
routers.use("/glaccounts", GLAccountRoutes_1.default);
//store routes
routers.use("/unit", UnitsRoutes_1.default);
routers.use("/itemcategory", ItemCategoryRoutes_1.default);
routers.use("/storeregister", StoreregisterRoutes_1.default);
routers.use("/itemregister", ItemRegisterRoutes_1.default);
routers.use("/storeitem", StoreItemRoutes_1.default);
routers.use("/storeissue", StoreIssueRoutes_1.default);
// ktchen
routers.use("/menuunit", MenuUnitRoutes_1.default);
routers.use("/menucategory", MenuCategoryRoutes_1.default);
routers.use("/menuregister", MenuRegisterRoutes_1.default);
routers.use("/menuitem", MenuItemRoutes_1.default);
routers.use("/kitchenstation", KitchenStationRoutes_1.default);
routers.use("/kitchensetup", KitchenSetupRoutes_1.default);
routers.use("/foodprocessing", FoodProcessingRoutes_1.default);
//purchase
//sales
routers.use("/cashier", CashierRegisterRoutes_1.default);
routers.use("/voidedbill", VoidedBillRoutes_1.default);
//payment
//payroll
// POS printer
//routers.use("/posprinter", POSPrinterRoutes)
exports.default = routers;
