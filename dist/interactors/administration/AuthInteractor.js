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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthInteractor = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const AppError_1 = require("../../utils/AppError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
let AuthInteractor = class AuthInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    login(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.login(input);
            if (!result) {
                throw new AppError_1.AppError("Invalid username or password", 401);
            }
            // Compare provided password with the hashed password
            let resultPassword = result.password ? result.password : "";
            const isPasswordValid = yield bcrypt_1.default.compare(input.password, resultPassword);
            // Check if the password is valid
            if (!isPasswordValid) {
                throw new AppError_1.AppError("Invalid username or password", 401);
            }
            // jwt token
            let userId = result.user_id ? result.user_id : "";
            const token = jsonwebtoken_1.default.sign({ userId: userId, userName: result.username, roles: result.roles }, // Payload
            process.env.JWT_SECRET, // Secret key from environment
            { expiresIn: "24h" } // Token expiration
            );
            return Object.assign(Object.assign({}, result), { token });
        });
    }
    forgotPassword(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.forgotPassword(input);
            return result;
        });
    }
    resetPassword(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.resetPassword(input);
            return result;
        });
    }
};
exports.AuthInteractor = AuthInteractor;
exports.AuthInteractor = AuthInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.AuthRepository))
], AuthInteractor);
