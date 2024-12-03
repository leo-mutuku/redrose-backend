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
exports.AccountRepository = void 0;
const AppError_1 = require("../../utils/AppError");
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
let AccountRepository = class AccountRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createAccount(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO accounts (account_name,gl_account_id , balance, created_by)
                VALUES ($1, $2, $3 ,$4)
                RETURNING *;
            `;
                const values = [input.account_name, input.gl_account_id, parseFloat(input.balance), parseInt(input.created_by)];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to create account: " + error, 500);
            }
        });
    }
    getAccountById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM accounts WHERE account_id = $1;
            `;
                const result = yield this.client.query(query, [id]);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError(`Account with id ${id} not found`, 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get account: " + error, 500);
            }
        });
    }
    updateAccount(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First, fetch the current account details
                const currentAccountQuery = `
                SELECT * FROM accounts WHERE account_id = $1;
            `;
                const currentAccountResult = yield this.client.query(currentAccountQuery, [id]);
                if (currentAccountResult.rows.length === 0) {
                    throw new AppError_1.AppError(`Account with id ${id} not found`, 404);
                }
                const currentAccount = currentAccountResult.rows[0];
                // Check if any fields have changed
                const updatedFields = [];
                const values = [];
                // Check if name has changed
                if (input.account_name && input.account_name !== currentAccount.name) {
                    updatedFields.push("account_name = $1");
                    values.push(input.account_name);
                }
                // Check if balance has changed
                if (input.balance !== undefined && parseFloat(input.balance) !== currentAccount.balance) {
                    updatedFields.push("balance = $2");
                    values.push(input.balance);
                }
                if (updatedFields.length === 0) {
                    // No fields have changed, throw an AppError
                    throw new AppError_1.AppError("No changes detected to update.", 400);
                }
                // Update the account with the changed fields
                const query = `
                UPDATE accounts
                SET ${updatedFields.join(", ")}
                WHERE account_id = $${values.length + 1}
                RETURNING *;
            `;
                // Add the account ID to the end of the values array
                values.push(id);
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to update account: " + error, 500);
            }
        });
    }
    getAllAccounts(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM accounts
                LIMIT $1 OFFSET $2;
            `;
                const result = yield this.client.query(query, [limit, offset]);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get accounts: " + error, 500);
            }
        });
    }
    deleteAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM accounts WHERE id = $1;
            `;
                const result = yield this.client.query(query, [id]);
                if (result.rowCount === 0) {
                    throw new AppError_1.AppError(`Account with id ${id} not found`, 404);
                }
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to delete account: " + error, 500);
            }
        });
    }
};
exports.AccountRepository = AccountRepository;
exports.AccountRepository = AccountRepository = __decorate([
    (0, inversify_1.injectable)()
], AccountRepository);
