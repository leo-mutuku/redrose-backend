
export const INTERFACE_TYPE = {
  // product test case
  ProductRepository: Symbol.for("ProductRepository"),
  ProductInteractor: Symbol.for("ProductInteractor"),
  ProductController: Symbol.for("ProductController"),
  // auth
  AuthRepository: Symbol.for("AuthRepository"),
  AuthInteractor: Symbol.for("AuthInteractor"),
  AuthController: Symbol.for("AuthController"),

  // user
  UserRepository: Symbol.for("UserRepository"),
  UserInteractor: Symbol.for("UserInteractor"),
  UserController: Symbol.for("UserController"),

  //staff
  StaffRepository: Symbol.for("StaffRepository"),
  StaffInteractor: Symbol.for("StaffInteractor"),
  StaffController: Symbol.for("StaffController"),

  // roles
  RoleRepository: Symbol.for("RoleRepository"),
  RoleInteractor: Symbol.for("RoleInteractor"),
  RoleController: Symbol.for("RoleController"),

  // user roles
  UserRoleRepository: Symbol.for("UserRoleRepository"),
  UserRoleInteractor: Symbol.for("UserRoleInteractor"),
  UserRoleController: Symbol.for("UserRoleController"),

  // shift
  ShiftRepository: Symbol.for("ShiftRepository"),
  ShiftInteractor: Symbol.for("ShiftInteractor"),
  ShiftController: Symbol.for("ShiftController"),

  // Supplier
  SupplierRepository: Symbol.for("SupplierRepository"),
  SupplierInteractor: Symbol.for("SupplierInteractor"),
  SupplierController: Symbol.for("SupplierController"),

  // vendors
  VendorRepository: Symbol.for("VendorRepository"),
  VendorInteractor: Symbol.for("VendorInteractor"),
  VendorController: Symbol.for("VendorController"),



  // finance module

  // Account
  AccountController: Symbol.for("AccountController"),
  AccountRepository: Symbol.for("AccountRepository"),
  AccountInteractor: Symbol.for("AccountInteractor"),

  //GLACCount
  GLAccountRepository: Symbol.for("GLAccountRepository"),
  GLAccountInteractor: Symbol.for("GLAccountInteractor"),
  GLAccountController: Symbol.for("GLAccountController"),

  //Bank
  BankRepository: Symbol.for("BankRepository"),
  BankInteractor: Symbol.for("BankInteractor"),
  BankController: Symbol.for("BankController"),

  //CashAccount
  CashAccountRepository: Symbol.for("CashAccountRepository"),
  CashAccountInteractor: Symbol.for("CashAccountInteractor"),
  CashAccountController: Symbol.for("CashAccountController"),

  //FundTransfer
  FundTransferRepository: Symbol.for("FundTransferRepository"),
  FundTransferInteractor: Symbol.for("FundTransferInteractor"),
  FundTransferController: Symbol.for("FundTransferController"),

  //MpesaTill
  MpesaTillRepository: Symbol.for("MpesaTillRepository"),
  MpesaTillInteractor: Symbol.for("MpesaTillInteractor"),
  MpesaTillController: Symbol.for("MpesaTillController"),


  // --------------------Store

  // item register
  ItemRegisterRepository: Symbol.for("ItemRegisterRepository"),
  ItemRegisterInteractor: Symbol.for("ItemRegisterInteractor"),
  ItemRegisterController: Symbol.for("ItemRegisterController"),

  // item tracking
  ItemTrackingRepository: Symbol.for("ItemTrackingRepository"),
  ItemTrackingInteractor: Symbol.for("ItemTrackingInteractor"),
  ItemTrackingController: Symbol.for("ItemTrackingController"),

  //Stock take headers
  StockTakeHeaderRepository: Symbol.for("StockTakeHeaderRepository"),
  StockTakeHeaderInteractor: Symbol.for("StockTakeHeaderInteractor"),
  StockTakeHeaderController: Symbol.for("StockTakeHeaderController"),

  //Stock take lines
  StockTakeLineRepository: Symbol.for("StockTakeLineRepository"),
  StockTakeLineInteractor: Symbol.for("StockTakeLineInteractor"),
  StockTakeLineController: Symbol.for("StockTakeLineController"),

  // Store issue
  StoreIssueRepository: Symbol.for("StoreIssueRepository"),
  StoreIssueInteractor: Symbol.for("StoreIssueInteractor"),
  StoreIssueController: Symbol.for("StoreIssueController"),


  //Store Items
  StoreItemRepository: Symbol.for("StoreItemRepository"),
  StoreItemInteractor: Symbol.for("StoreItemInteractor"),
  StoreItemController: Symbol.for("StoreItemController"),

  //Store register
  StoreRegisterRepository: Symbol.for("StoreRegisterRepository"),
  StoreRegisterInteractor: Symbol.for("StoreRegisterInteractor"),
  StoreRegisterController: Symbol.for("StoreRegisterController"),

  // hot kitchen store
  HotKitchenStoreRepository: Symbol.for("HotKitchenStoreRepository"),
  HotKitchenStoreInteractor: Symbol.for("HotKitchenStoreInteractor"),
  HotKitchenStoreController: Symbol.for("HotKitchenStoreController"),
  // store transfer
  StoreTransferRepository: Symbol.for("StoreTransferRepository"),
  StoreTransferInteractor: Symbol.for("StoreTransferInteractor"),
  StoreTransferController: Symbol.for("StoreTransferController"),

  // Units
  UnitRepository: Symbol.for("UnitRepository"),
  UnitInteractor: Symbol.for("UnitInteractor"),
  UnitController: Symbol.for("UnitController"),

  // Item category
  ItemCategoryRepository: Symbol.for("ItemCategoryRepository"),
  ItemCategoryInteractor: Symbol.for("ItemCategoryInteractor"),
  ItemCategoryController: Symbol.for("ItemCategoryController"),

  // Restaurant Store
  RestaurantStoreRepository: Symbol.for("RestaurantStoreRepository"),
  RestaurantStoreInteractor: Symbol.for("RestaurantStoreInteractor"),
  RestaurantStoreController: Symbol.for("RestaurantStoreController"),


  // kichen 

  // menu units
  MenuUnitRepository: Symbol.for("MenuUnitRepository"),
  MenuUnitInteractor: Symbol.for("MenuUnitInteractor"),
  MenuUnitController: Symbol.for("MenuUnitController"),
  // Menu register
  MenuRegisterRepository: Symbol.for("MenuRegisterRepository"),
  MenuRegisterInteractor: Symbol.for("MenuRegisterInteractor"),
  MenuRegisterController: Symbol.for("MenuRegisterController"),

  // Menu item
  MenuItemRepository: Symbol.for("MenuItemRepository"),
  MenuItemInteractor: Symbol.for("MenuItemInteractor"),
  MenuItemController: Symbol.for("MenuItemController"),

  // Menu Category
  MenuCategoryRepository: Symbol.for("MenuCategoryRepository"),
  MenuCategoryInteractor: Symbol.for("MenuCategoryInteractor"),
  MenuCategoryController: Symbol.for("MenuCategoryController"),

  // Kichen Statition
  KitchenStationRepository: Symbol.for("KitchenStationRepository"),
  KitchenStationInteractor: Symbol.for("KitchenStationInteractor"),
  KitchenStationController: Symbol.for("KitchenStationController"),

  // Kitchen Setup
  KitchenSetupRepository: Symbol.for("KitchenSetupRepository"),
  KitchenSetupInteractor: Symbol.for("KitchenSetupInteractor"),
  KitchenSetupController: Symbol.for("KitchenSetupController"),

  //Food Processing
  FoodProcessingRepository: Symbol.for("FoodProcessingRepository"),
  FoodProcessingInteractor: Symbol.for("FoodProcessingInteractor"),
  FoodProcessingController: Symbol.for("FoodProcessingController"),

  // Kitchen stock take
  KitchenStockTakeRepository: Symbol.for("KitchenStockTakeRepository"),
  KitchenStockTakeInteractor: Symbol.for("KitchenStockTakeInteractor"),
  KitchenStockTakeController: Symbol.for("KitchenStockTakeController"),



  // ---------------------------------Purchases
  //Purchase order
  PurchaseOrderRepository: Symbol.for("PurchaseOrderRepository"),
  PurchaseOrderInteractor: Symbol.for("PurchaseOrderInteractor"),
  PurchaseOrderController: Symbol.for("PurchaseOrderController"),

  //Purchase Requisition
  PurchaseRequisitionRepository: Symbol.for("PurchaseRequisitionRepository"),
  PurchaseRequisitionInteractor: Symbol.for("PurchaseRequisitionInteractor"),
  PurchaseRequisitionController: Symbol.for("PurchaseRequisitionController"),

  // ----------------------------------Sales
  //Sales order
  SalesOrderRepository: Symbol.for("SalesOrderRepository"),
  SalesOrderInteractor: Symbol.for("SalesOrderInteractor"),
  SalesOrderController: Symbol.for("SalesOrderController"),

  //Sales order clearance
  SalesOrderClearanceRepository: Symbol.for("SalesOrderClearanceRepository"),
  SalesOrderClearanceInteractor: Symbol.for("SalesOrderClearanceInteractor"),
  SalesOrderClearanceController: Symbol.for("SalesOrderClearanceController"),

  // cashier Register
  CashierRegisterRepository: Symbol.for("CashierRegisterRepository"),
  CashierRegisterInteractor: Symbol.for("CashierRegisterInteractor"),
  CashierRegisterController: Symbol.for("CashierRegisterController"),

  // WaitStaff Register
  WaitStaffRegisterRepository: Symbol.for("WaitStaffRegisterRepository"),
  WaitStaffRegisterInteractor: Symbol.for("WaitStaffRegisterInteractor"),
  WaitStaffRegisterController: Symbol.for("WaitStaffRegisterController"),

  // Voided Bill
  VoidedBillRepository: Symbol.for("VoidedBillRepository"),
  VoidedBillInteractor: Symbol.for("VoidedBillInteractor"),
  VoidedBillController: Symbol.for("VoidedBillController"),

  // Cancelled order
  CancelledOrderRepository: Symbol.for("CancelledOrderRepository"),
  CancelledOrderController: Symbol.for("CancelledOrderController"),
  CancelledOrderInteractor: Symbol.for("CancelledOrderInteractor"),

  //SalesOrderClearingRepository
  SalesOrderClearingRepository: Symbol.for("SalesOrderClearingRepository"),
  SalesOrderClearingInteractor: Symbol.for("SalesOrderClearingInteractor"),
  SalesOrderClearingController: Symbol.for("SalesOrderClearingController"),




  //

  // --------------------------Payments

  // PaymentVoucherRepository
  PaymentVoucherRepository: Symbol.for("PaymentVoucherRepository"),
  PaymentVoucherInteractor: Symbol.for("PaymentVoucherInteractor"),
  PaymentVoucherController: Symbol.for("PaymentVoucherController"),

  // VendorSupplierPayyment
  VendorSupplierPaymentRepository: Symbol.for("VendorSupplierPaymentRepository"),
  VendorSupplierPaymentInteractor: Symbol.for("VendorSupplierPaymentInteractor"),
  VendorSupplierPaymentController: Symbol.for("VendorSupplierPaymentController"),

  //------------------------------Payroll
  // Payroll Setup
  PayrollSetupRepository: Symbol.for("PayrollSetupRepository"),
  PayrollSetupInteractor: Symbol.for("PayrollSetupInteractor"),
  PayrollSetupController: Symbol.for("PayrollSetupController"),

  // Payroll Entries
  PayrollEntriesRepository: Symbol.for("PayrollEntriesRepository"),
  PayrollEntriesInteractor: Symbol.for("PayrollEntriesInteractor"),
  PayrollEntriesController: Symbol.for("PayrollEntriesController"),


  //Payroll
  PayrollRepository: Symbol.for("PayrollRepository"),
  PayrollInteractor: Symbol.for("PayrollInteractor"),
  PayrollController: Symbol.for("PayrollController"),

  // DeductionRepository
  DeductionRepository: Symbol.for("DeductionRepository"),
  DeductionInteractor: Symbol.for("DeductionInteractor"),
  DeductionController: Symbol.for("DeductionController"),

  //PayrollCategoryRepository
  PayrollCategoryRepository: Symbol.for("PayrollCategoryRepository"),
  PayrollCategoryInteractor: Symbol.for("PayrollCategoryInteractor"),
  PayrollCategoryController: Symbol.for("PayrollCategoryController"),
  // --------------------------------global


  // global
  Mailer: Symbol.for("Mailer"),
  MessageBroker: Symbol.for("MessageBroker"),

  // sms
  SMSExternalLibrary: Symbol.for("SMSExternalLibrary"),
  SMSRepository: Symbol.for("SMSRepository"),
  SMSInteractor: Symbol.for("SMSInteractor"),
  SMSController: Symbol.for("SMSController"),

  //pos print
  POSPrintController: Symbol.for("POSPrintController"),
  POSPrintInteractor: Symbol.for("POSPrintInteractor"),
  POSPrintRepository: Symbol.for("POSPrintRepository"),
  POSPrinterExternalLibrary: Symbol.for("POSPrinterExternalLibrary"),

};
