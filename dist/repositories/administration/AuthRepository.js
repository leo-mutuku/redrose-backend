"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.AuthRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let AuthRepository = class AuthRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username }) {
            try {
                const query = "SELECT user_id, username, first_name, last_name, created_by,password, TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at FROM users WHERE username = $1";
                const values = [username];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    // Throw operational error for invalid login
                    throw new AppError_1.AppError("Invalid username or password", 401);
                }
                // Return get user roles
                const user = result.rows[0];
                const query2 = "SELECT role_id FROM user_roles WHERE user_id = $1";
                const values2 = [user.user_id];
                const result2 = yield this.client.query(query2, values2);
                const roles = result2.rows.map((row) => row.role_id);
                console.log(roles);
                return Object.assign(Object.assign({}, result.rows[0]), { roles });
            }
            catch (error) {
                // Re-throw unexpected errors with context
                if (error instanceof AppError_1.AppError) {
                    throw error; // Re-throw operational AppErrors to be handled by middleware
                }
                // Wrap and propagate unexpected errors
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                throw new AppError_1.AppError(`Error occurred during login: ${errorMessage}`, 500, false // Mark as non-operational if it's an unexpected error
                );
            }
        });
    }
    forgotPassword(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = "SELECT user_id, username, first_name, last_name, created_by, TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at FROM users  FROM users WHERE user_name = $1";
                const values = [username];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new Error("Error logging in" + error);
            }
        });
    }
    resetPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, password }) {
            try {
                const query = "UPDATE users SET password = $1 WHERE user_name = $2";
                const values = [username, password];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new Error("Error logging in" + error);
            }
        });
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, inversify_1.injectable)()
], AuthRepository);
