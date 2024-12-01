

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


  //Store Items
  StoreItemRepository: Symbol.for("StoreItemRepository"),
  StoreItemInteractor: Symbol.for("StoreItemInteractor"),
  StoreItemController: Symbol.for("StoreItemController"),

  //Store register
  StoreRegisterRepository: Symbol.for("StoreRegisterRepository"),
  StoreRegisterInteractor: Symbol.for("StoreRegisterInteractor"),
  StoreRegisterController: Symbol.for("StoreRegisterController"),

  // Units
  UnitRepository: Symbol.for("UnitRepository"),
  UnitInteractor: Symbol.for("UnitInteractor"),
  UnitController: Symbol.for("UnitController"),

  // Item category
  ItemCategoryRepository: Symbol.for("ItemCategoryRepository"),
  ItemCategoryInteractor: Symbol.for("ItemCategoryInteractor"),
  ItemCategoryController: Symbol.for("ItemCategoryController"),


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
