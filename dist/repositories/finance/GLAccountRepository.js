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
exports.GLAccountRepository = void 0;
const AppError_1 = require("../../utils/AppError");
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
let GLAccountRepository = class GLAccountRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createGLAccount(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO gl_accounts (gl_account_name,  balance, created_by)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
                const values = [
                    input.gl_account_name,
                    input.balance,
                    input.balance,
                ];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to create GL account: " + error, 500);
            }
        });
    }
    getGLAccountById(accountCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM gl_accounts WHERE gl_account_id = $1;
            `;
                const result = yield this.client.query(query, [accountCode]);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError(`GL account with code ${accountCode} not found`, 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get GL account: " + error, 500);
            }
        });
    }
    updateGLAccount(accountCode, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First, fetch the current GL account details
                const currentAccountQuery = `
                SELECT * FROM gl_accounts WHERE gl_account_id = $1;
            `;
                const currentAccountResult = yield this.client.query(currentAccountQuery, [accountCode]);
                if (currentAccountResult.rows.length === 0) {
                    throw new AppError_1.AppError(`GL account with code ${accountCode} not found`, 404);
                }
                const currentAccount = currentAccountResult.rows[0];
                // Track which fields have changed
                const updatedFields = [];
                const values = [];
                // Dynamically track placeholder indices
                if (input.gl_account_name && input.gl_account_name !== currentAccount.gl_account_name) {
                    updatedFields.push(`gl_account_name = $${values.length + 1}`);
                    values.push(input.gl_account_name);
                }
                if (input.balance !== undefined && input.balance !== currentAccount.balance) {
                    updatedFields.push(`balance = $${values.length + 1}`);
                    values.push(input.balance);
                }
                // If no fields have changed, throw an error
                if (updatedFields.length === 0) {
                    throw new AppError_1.AppError("No changes detected to update GL account.", 400);
                }
                // Proceed with updating the GL account
                const query = `
                UPDATE gl_accounts
                SET ${updatedFields.join(", ")}
                WHERE gl_account_id = $${values.length + 1}
                RETURNING *;
            `;
                // Add the accountCode to the values array
                values.push(accountCode);
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to update GL account: " + error, 500);
            }
        });
    }
    getAllGLAccounts(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM gl_accounts
                LIMIT $1 OFFSET $2;
            `;
                const result = yield this.client.query(query, [limit, offset]);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get GL accounts: " + error, 500);
            }
        });
    }
    deleteGLAccount(accountCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM gl_accounts WHERE account_code = $1;
            `;
                const result = yield this.client.query(query, [accountCode]);
                if (result.rowCount === 0) {
                    throw new AppError_1.AppError(`GL account with code ${accountCode} not found`, 404);
                }
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to delete GL account: " + error, 500);
            }
        });
    }
};
exports.GLAccountRepository = GLAccountRepository;
exports.GLAccountRepository = GLAccountRepository = __decorate([
    (0, inversify_1.injectable)()
], GLAccountRepository);
