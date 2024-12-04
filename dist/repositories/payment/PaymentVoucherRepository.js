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
exports.PaymentVoucherRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let PaymentVoucherRepository = class PaymentVoucherRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    // Create a new payment voucher
    createPaymentVoucher(_a) {
        return __awaiter(this, arguments, void 0, function* ({ voucher_number, amount, description, payment_date }) {
            try {
                const query = `
                INSERT INTO payment_voucher (voucher_number, amount, description, payment_date)
                VALUES ($1, $2, $3, $4)
                RETURNING payment_voucher_id, voucher_number, amount, description, 
                TO_CHAR(payment_date, 'DD/MM/YYYY') AS payment_date
            `;
                const values = [voucher_number, amount, description, payment_date];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating payment voucher: ' + error, 500);
            }
        });
    }
    // Get a list of payment vouchers with pagination
    getPaymentVouchers(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT payment_voucher_id, voucher_number, amount, description, 
                TO_CHAR(payment_date, 'DD/MM/YYYY') AS payment_date
                FROM payment_voucher
                LIMIT $1 OFFSET $2
            `;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching payment vouchers: ' + error, 500);
            }
        });
    }
    // Get a single payment voucher by ID
    getPaymentVoucher(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT payment_voucher_id, voucher_number, amount, description, 
                TO_CHAR(payment_date, 'DD/MM/YYYY') AS payment_date
                FROM payment_voucher
                WHERE payment_voucher_id = $1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Payment voucher not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching payment voucher: ' + error, 500);
            }
        });
    }
    // Update an existing payment voucher
    updatePaymentVoucher(id, paymentVoucher) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE payment_voucher SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(paymentVoucher).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE payment_voucher_id = $${values.length + 1} RETURNING 
                payment_voucher_id, voucher_number, amount, description,
                TO_CHAR(payment_date, 'DD/MM/YYYY') AS payment_date`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Payment voucher not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating payment voucher: ' + error, 500);
            }
        });
    }
};
exports.PaymentVoucherRepository = PaymentVoucherRepository;
exports.PaymentVoucherRepository = PaymentVoucherRepository = __decorate([
    (0, inversify_1.injectable)()
], PaymentVoucherRepository);
