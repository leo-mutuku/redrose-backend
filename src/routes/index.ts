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
import StoreRegisterRoutes from "./store/StoreRegisterRoutes"
import ItemRegisterRoutes from "./store/ItemRegisterRoutes"
import StoreItemRoutes from "./store/StoreItemRoutes"
import StoreIssueRoutes from "./store/StoreIssueRoutes"
import HotKitchenRoutes from "./store/HotKitchenStoreRoutes"
import StoreTransferRooutes from "./store/StoreTransferRoutes"



// ktchen
import MenuUnitRoutes from "./kitchen/MenuUnitRoutes"
import MenuCategory from "./kitchen/MenuCategoryRoutes"
import MenuRegister from "./kitchen/MenuRegisterRoutes"
import MenuItemRoutes from "./kitchen/MenuItemRoutes"
import KitchenStationRoutes from "./kitchen/KitchenStationRoutes"
import KitchenSetupRoutes from "./kitchen/KitchenSetupRoutes"
import FoodProcessingRoutes from "./kitchen/FoodProcessingRoutes"



// sales routes
import CashierRoutes from "./sales/CashierRegisterRoutes"
import VoidedBillRoures from "./sales/VoidedBillRoutes"
import SalesOrderRoutes from "./sales/SalesOrderRoutes"
import WaitStaffRoutes from "./sales/WaitStaffRegisterRoutes"
import CancelledOrderRoutes from "./sales/CancelledOrderRoutes"
import SalesOrderClearingRoutes from "./sales/SalesOrderCleararingRoutes"


//purchase routes
import PurchaseOrderRoutes from "./purchase/PurchaseOrderRoutes"
import PurchaseRequisitionRoutes from "./purchase/PurchaseRequisition"


//payroll routes
import DeductionRoutes from "./payroll/DeductionRoutes"
import PayrollRoutes from "./payroll/PayrollRoutes"
import PayrollSetupRoutes from "./payroll/PayrollSetupRoutes"
import PayrollCategoryRoutes from "./payroll/PayrollCategoryRoutes"


//payment
import PaymentVoucher from "./payment/PaymentVoucherRoutes"




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
routers.use("/hotkitchen", HotKitchenRoutes)
routers.use("/storetransfer", StoreTransferRooutes)


// ktchen
routers.use("/menuunit", MenuUnitRoutes)
routers.use("/menucategory", MenuCategory)
routers.use("/menuregister", MenuRegister)
routers.use("/menuitem", MenuItemRoutes)
routers.use("/kitchenstation", KitchenStationRoutes)
routers.use("/kitchensetup", KitchenSetupRoutes)
routers.use("/foodprocessing", FoodProcessingRoutes)

//purchase
routers.use("/purchaseorder", PurchaseOrderRoutes)
routers.use("/purchaserequisition", PurchaseRequisitionRoutes)

//sales
routers.use("/cashier", CashierRoutes)
routers.use("/voidedbill", VoidedBillRoures)
routers.use("/salesorder", SalesOrderRoutes)
routers.use("/salesorderclearing", SalesOrderClearingRoutes)
routers.use("/cancelledorder", CancelledOrderRoutes)
routers.use("/waitstaff", WaitStaffRoutes)






//payment
routers.use("/payment", PaymentVoucher)




//payroll
routers.use("/deduction", DeductionRoutes)
routers.use("/payroll", PayrollRoutes)
routers.use("/payrollsetup", PayrollSetupRoutes)
routers.use("/payrollcategory", PayrollCategoryRoutes)
// routers.use("/waitstaff", WaitStaffRegisterRoutes)


// POS printer
//routers.use("/posprinter", POSPrinterRoutes)


export default routers;