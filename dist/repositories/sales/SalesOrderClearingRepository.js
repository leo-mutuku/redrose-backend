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
exports.SalesOrderClearingRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let SalesOrderClearingRepository = class SalesOrderClearingRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    // Create a new sales order clearing record
    createSalesOrderClearing() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO sales_order_clearing (sales_order_id, cleared_by, cleared_date, clearing_amount)
                VALUES ($1, $2, $3, $4)
                RETURNING sales_order_clearing_id, sales_order_id, cleared_by, cleared_date, clearing_amount, created_at
            `;
                const values = [];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating sales order clearing: ' + error, 500);
            }
        });
    }
    // Get a list of sales order clearings with pagination
    getSalesOrderClearings(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT sales_order_clearing_id, sales_order_id, cleared_by, cleared_date, clearing_amount, created_at
                FROM sales_order_clearing
                LIMIT $1 OFFSET $2
            `;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching sales order clearings: ' + error, 500);
            }
        });
    }
    // Get a single sales order clearing by ID
    getSalesOrderClearing(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT sales_order_clearing_id, sales_order_id, cleared_by, cleared_date, clearing_amount, created_at
                FROM sales_order_clearing
                WHERE sales_order_clearing_id = $1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Sales order clearing not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching sales order clearing: ' + error, 500);
            }
        });
    }
    // Update an existing sales order clearing
    updateSalesOrderClearing(id, salesOrderClearing) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE sales_order_clearing SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(salesOrderClearing).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE sales_order_clearing_id = $${values.length + 1} RETURNING 
                sales_order_clearing_id, sales_order_id, cleared_by, cleared_date, clearing_amount, created_at`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Sales order clearing not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating sales order clearing: ' + error, 500);
            }
        });
    }
    // Delete a sales order clearing by ID
    deleteSalesOrderClearing(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM sales_order_clearing
                WHERE sales_order_clearing_id = $1
                RETURNING sales_order_clearing_id, sales_order_id, cleared_by, cleared_date, clearing_amount, created_at
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Sales order clearing not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error deleting sales order clearing: ' + error, 500);
            }
        });
    }
};
exports.SalesOrderClearingRepository = SalesOrderClearingRepository;
exports.SalesOrderClearingRepository = SalesOrderClearingRepository = __decorate([
    (0, inversify_1.injectable)()
], SalesOrderClearingRepository);
