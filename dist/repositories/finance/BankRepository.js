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
exports.BankRepository = void 0;
const AppError_1 = require("../../utils/AppError");
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
let BankRepository = class BankRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createBank(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO banks (bank_name, balance,bank_number created_by)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
                const values = [input.bank_name, input.bank_number, input.balance, input.created_by];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to create bank: " + error, 500);
            }
        });
    }
    getBankById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM banks WHERE bank_id = $1;
            `;
                const result = yield this.client.query(query, [id]);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError(`Bank with id ${id} not found`, 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get bank: " + error, 500);
            }
        });
    }
    updateBank(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Fetch the current bank details
                const currentBankQuery = `
                SELECT * FROM banks WHERE bank_id = $1;
            `;
                const currentBankResult = yield this.client.query(currentBankQuery, [id]);
                if (currentBankResult.rows.length === 0) {
                    throw new AppError_1.AppError(`Bank with id ${id} not found`, 404);
                }
                const currentBank = currentBankResult.rows[0];
                // Step 2: Track changes and prepare the update fields
                const updatedFields = [];
                const values = [];
                // Dynamically add placeholders
                if (input.bank_name && input.bank_name !== currentBank.bank_name) {
                    updatedFields.push(`bank_name = $${values.length + 1}`);
                    values.push(input.bank_name);
                }
                // bank_number
                if (input.bank_number && input.bank_number !== currentBank.bank_number) {
                    updatedFields.push(`bank_number = $${values.length + 1}`);
                    values.push(input.bank_number);
                }
                if (input.balance !== undefined && parseFloat(input.balance) !== currentBank.balance) {
                    updatedFields.push(`balance = $${values.length + 1}`);
                    values.push(input.balance);
                }
                if (input.created_by && input.created_by !== currentBank.created_by) {
                    updatedFields.push(`created_by = $${values.length + 1}`);
                    values.push(input.created_by);
                }
                if (updatedFields.length === 0) {
                    throw new AppError_1.AppError("No changes detected to update bank.", 400);
                }
                // Step 3: Build the dynamic query for the update
                const query = `
                UPDATE banks
                SET ${updatedFields.join(", ")}
                WHERE bank_id = $${values.length + 1}
                RETURNING *;
            `;
                // Step 4: Add the id to the values array
                values.push(id);
                // Execute the query
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to update bank: " + error, 500);
            }
        });
    }
    getAllBanks(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM banks
                LIMIT $1 OFFSET $2;
            `;
                const result = yield this.client.query(query, [limit, offset]);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get banks: " + error, 500);
            }
        });
    }
    deleteBank(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM banks WHERE id = $1;
            `;
                const result = yield this.client.query(query, [id]);
                if (result.rowCount === 0) {
                    throw new AppError_1.AppError(`Bank with id ${id} not found`, 404);
                }
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to delete bank: " + error, 500);
            }
        });
    }
};
exports.BankRepository = BankRepository;
exports.BankRepository = BankRepository = __decorate([
    (0, inversify_1.injectable)()
], BankRepository);
