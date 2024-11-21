
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
  Mailer: Symbol.for("Mailer"),
  MessageBroker: Symbol.for("MessageBroker"),
};
