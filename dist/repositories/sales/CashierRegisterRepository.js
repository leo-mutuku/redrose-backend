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
exports.CashierRegisterRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let CashierRegisterRepository = class CashierRegisterRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    openCashierRegister(input) {
        throw new Error("Method not implemented.");
    }
    // Create a new cashier register record
    createCashierRegister(_a) {
        return __awaiter(this, arguments, void 0, function* ({ staff_id, balance, pin, created_by }) {
            try {
                const query = `
                INSERT INTO sales_cashiers (staff_id,
    balance,
      pin ,
    created_by)
                VALUES ($1, $2, $3, $4 )
                RETURNING sales_cashier_id, staff_id,  balance, created_by, created_at
            `;
                const values = [staff_id,
                    balance,
                    pin,
                    created_by];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating cashier register: ' + error, 500);
            }
        });
    }
    // Get a list of cashier registers with pagination
    getCashierRegisters(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                 SELECT  sc.sales_cashier_id, sc.balance, sc.created_by, sc.created_at,
                s.first_name || ''||  s.last_name as cashier_name
                FROM sales_cashiers sc
                inner join staff s on s.staff_id = sc.staff_id
                LIMIT $1 OFFSET $2
            `;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching cashier registers: ' + error, 500);
            }
        });
    }
    // Get a single cashier register by ID
    getCashierRegister(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT  sc.sales_cashier_id, sc.balance, sc.created_by, sc.created_at,
                s.first_name || ''||  s.last_name as cashier_name
                FROM sales_cashiers sc
                inner join staff s on s.staff_id = sc.staff_id
                WHERE sales_cashier_id = $1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Cashier register not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching cashier register: ' + error, 500);
            }
        });
    }
    // Update an existing cashier register
    updateCashierRegister(id, cashierRegister) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE sales_cashiers SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(cashierRegister).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE sales_cashier_id = $${values.length + 1} RETURNING 
                sales_cashier_id, balance,  created_by, created_at`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Cashier register not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating cashier register: ' + error, 500);
            }
        });
    }
    // Delete a cashier register by ID
    deleteCashierRegister(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM cashier_register
                WHERE cashier_register_id = $1
                RETURNING cashier_register_id, register_number, cashier_id, opening_balance, status, created_by, created_at
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Cashier register not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error deleting cashier register: ' + error, 500);
            }
        });
    }
};
exports.CashierRegisterRepository = CashierRegisterRepository;
exports.CashierRegisterRepository = CashierRegisterRepository = __decorate([
    (0, inversify_1.injectable)()
], CashierRegisterRepository);
