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
exports.StoreRegisterRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let StoreRegisterRepository = class StoreRegisterRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createRegister(_a) {
        return __awaiter(this, arguments, void 0, function* ({ store_name, location }) {
            try {
                const query = `
                INSERT INTO store_register (store_name, location)
                VALUES ($1, $2)
                RETURNING store_id, store_name, location, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
                const values = [store_name, location];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating store register: ' + error, 500);
            }
        });
    }
    getRegisters(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT store_id, store_name, location,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM store_register
              ORDER BY created_at DESC
            `;
                const result = yield this.client.query(query);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching store registers: ' + error, 500);
            }
        });
    }
    getRegister(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT store_id, store_name, location,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM store_register
                WHERE store_id = $1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Store register not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching store register: ' + error, 500);
            }
        });
    }
    updateRegister(id, storeRegister) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE store_register SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(storeRegister).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE store_id = $${values.length + 1} RETURNING 
                store_id, store_name, location,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Store register not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating store register: ' + error, 500);
            }
        });
    }
};
exports.StoreRegisterRepository = StoreRegisterRepository;
exports.StoreRegisterRepository = StoreRegisterRepository = __decorate([
    (0, inversify_1.injectable)()
], StoreRegisterRepository);
