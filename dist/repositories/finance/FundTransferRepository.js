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
exports.FundTransferRepository = void 0;
const AppError_1 = require("../../utils/AppError");
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
let FundTransferRepository = class FundTransferRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createFundTransfer(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO fund_transfers (source_account_id, target_account_id, amount, transfer_date, remarks)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
                const values = [
                    input.source_account_id,
                    input.target_account_id,
                    input.amount,
                    input.transfer_date,
                    input.remarks,
                ];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to create fund transfer: " + error, 500);
            }
        });
    }
    getFundTransferById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM fund_transfers WHERE id = $1;
            `;
                const result = yield this.client.query(query, [id]);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError(`Fund transfer with id ${id} not found`, 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get fund transfer: " + error, 500);
            }
        });
    }
    updateFundTransfer(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                UPDATE fund_transfers
                SET source_account_id = $1, target_account_id = $2, amount = $3, transfer_date = $4, remarks = $5
                WHERE id = $6
                RETURNING *;
            `;
                const values = [
                    input.source_account_id,
                    input.target_account_id,
                    input.amount,
                    input.transfer_date,
                    input.remarks,
                    id,
                ];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError(`Fund transfer with id ${id} not found`, 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to update fund transfer: " + error, 500);
            }
        });
    }
    getAllFundTransfers(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM fund_transfers
                LIMIT $1 OFFSET $2;
            `;
                const result = yield this.client.query(query, [limit, offset]);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get fund transfers: " + error, 500);
            }
        });
    }
    deleteFundTransfer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM fund_transfers WHERE id = $1;
            `;
                const result = yield this.client.query(query, [id]);
                if (result.rowCount === 0) {
                    throw new AppError_1.AppError(`Fund transfer with id ${id} not found`, 404);
                }
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to delete fund transfer: " + error, 500);
            }
        });
    }
};
exports.FundTransferRepository = FundTransferRepository;
exports.FundTransferRepository = FundTransferRepository = __decorate([
    (0, inversify_1.injectable)()
], FundTransferRepository);
