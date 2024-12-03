"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
let AuthController = class AuthController {
    constructor(authInteractor) {
        this.authInteractor = authInteractor;
    }
    onLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const result = yield this.authInteractor.login(body);
                // Send token in the Authorization header
                const token = result.token;
                // Set the token in the Authorization header
                res.setHeader("Authorization", `Bearer ${token}`);
                // Return the result along with a success message
                res.json({
                    status: "success",
                    data: result,
                    message: "Login successful"
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onForgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const result = yield this.authInteractor.forgotPassword(body);
            res.json({ status: "success", data: result, message: "Password reset successful" });
        });
    }
    onResetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const result = yield this.authInteractor.resetPassword(body);
            res.json({ status: "success", data: result, message: "Password reset successful" });
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.AuthInteractor))
], AuthController);
