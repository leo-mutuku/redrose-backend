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
exports.CashAccountRepository = void 0;
const AppError_1 = require("../../utils/AppError");
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
let CashAccountRepository = class CashAccountRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createCashAccount(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO cash_accounts (cash_account_name, balance, created_by)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
                const values = [input.cash_account_name, input.balance, input.created_by];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to create cash account: " + error, 500);
            }
        });
    }
    getCashAccountById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM cash_accounts WHERE cash_account_id = $1;
            `;
                const result = yield this.client.query(query, [id]);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError(`Cash account with id ${id} not found`, 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get cash account: " + error, 500);
            }
        });
    }
    updateCashAccount(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Fetch the current cash account details
                const currentCashAccountQuery = `
                SELECT * FROM cash_accounts WHERE cash_account_id = $1;
            `;
                const currentCashAccountResult = yield this.client.query(currentCashAccountQuery, [id]);
                if (currentCashAccountResult.rows.length === 0) {
                    throw new AppError_1.AppError(`Cash account with id ${id} not found`, 404);
                }
                const currentCashAccount = currentCashAccountResult.rows[0];
                // Step 2: Track changes and prepare the update fields
                const updatedFields = [];
                const values = [];
                // Dynamically add placeholders
                if (input.cash_account_name && input.cash_account_name !== currentCashAccount.cash_account_name) {
                    updatedFields.push(`cash_account_name = $${values.length + 1}`);
                    values.push(input.cash_account_name);
                }
                const parsedBalance = parseFloat(input.balance);
                if (!isNaN(parsedBalance) && parsedBalance !== currentCashAccount.balance) {
                    updatedFields.push(`balance = $${values.length + 1}`);
                    values.push(parsedBalance);
                }
                if (input.created_by && input.created_by !== currentCashAccount.created_by) {
                    updatedFields.push(`created_by = $${values.length + 1}`);
                    values.push(input.created_by);
                }
                // If no fields have changed, throw an error
                if (updatedFields.length === 0) {
                    throw new AppError_1.AppError("No changes detected to update cash account.", 400);
                }
                // Step 3: Build the dynamic query for the update
                const query = `
                UPDATE cash_accounts
                SET ${updatedFields.join(", ")}
                WHERE cash_account_id = $${values.length + 1}
                RETURNING *;
            `;
                // Step 4: Add the id to the values array
                values.push(id);
                // Execute the query
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to update cash account: " + error, 500);
            }
        });
    }
    getAllCashAccounts(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM cash_accounts
                LIMIT $1 OFFSET $2;
            `;
                const result = yield this.client.query(query, [limit, offset]);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get cash accounts: " + error, 500);
            }
        });
    }
    deleteCashAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM cash_accounts WHERE id = $1;
            `;
                const result = yield this.client.query(query, [id]);
                if (result.rowCount === 0) {
                    throw new AppError_1.AppError(`Cash account with id ${id} not found`, 404);
                }
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to delete cash account: " + error, 500);
            }
        });
    }
};
exports.CashAccountRepository = CashAccountRepository;
exports.CashAccountRepository = CashAccountRepository = __decorate([
    (0, inversify_1.injectable)()
], CashAccountRepository);
