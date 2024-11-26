
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



  // global
  Mailer: Symbol.for("Mailer"),
  MessageBroker: Symbol.for("MessageBroker"),

  // sms
  SMSExternalLibrary: Symbol.for("SMSExternalLibrary"),
  SMSInteractor: Symbol.for("SMSInteractor"),
  SMSController: Symbol.for("SMSController"),
};
