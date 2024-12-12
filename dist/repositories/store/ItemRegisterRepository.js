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
exports.ItemRegisterRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let ItemRegisterRepository = class ItemRegisterRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createRegister(_a) {
        return __awaiter(this, arguments, void 0, function* ({ item_name, item_description, created_by }) {
            try {
                const query = `
            INSERT INTO item_register (item_name, item_description, created_by)
            VALUES ($1, $2, $3)
            RETURNING 
                item_id, 
                item_name, 
                item_description, 
                created_by, 
                created_at, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
                (SELECT first_name || ' ' || last_name AS fullname 
                 FROM users 
                 WHERE user_id = item_register.created_by) AS created_by_name
        `;
                const values = [item_name, item_description, created_by];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating item register: ' + error, 500);
            }
        });
    }
    getRegisters(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                 SELECT 
    ir.item_id, 
    ir.item_name, 
    ir.item_description, 
    TO_CHAR(ir.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    CASE
        WHEN u.first_name IS NOT NULL AND u.last_name IS NOT NULL THEN u.first_name || ' ' || u.last_name
        ELSE 'Unknown'  -- Return 'Unknown' if the user is not found
    END AS created_by_name
FROM item_register ir

LEFT JOIN users u ON ir.created_by = u.user_id


            `;
                // const values = [limit, offset];
                const result = yield this.client.query(query);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching item registers: ' + error, 500);
            }
        });
    }
    getRegister(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                 SELECT 
    ir.item_id, 
    ir.item_name, 
    ir.item_description, 
    TO_CHAR(ir.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    CASE
        WHEN u.first_name IS NOT NULL AND u.last_name IS NOT NULL THEN u.first_name || ' ' || u.last_name
        ELSE 'Unknown'  -- Return 'Unknown' if the user is not found
    END AS created_by_name
FROM item_register ir

LEFT JOIN users u ON ir.created_by = u.user_id
where ir.item_id = $1
LIMIT 20 OFFSET 0
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Item register not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching item register: ' + error, 500);
            }
        });
    }
    updateRegister(id, register) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE item_register SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(register).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE item_id = $${values.length + 1} RETURNING 
                 item_id, 
                item_name, 
                item_description, 
                created_by, 
                created_at, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
                (SELECT first_name || ' ' || last_name AS fullname 
                 FROM users 
                 WHERE user_id = item_register.created_by) AS created_by_name`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Item register not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating item register: ' + error, 500);
            }
        });
    }
};
exports.ItemRegisterRepository = ItemRegisterRepository;
exports.ItemRegisterRepository = ItemRegisterRepository = __decorate([
    (0, inversify_1.injectable)()
], ItemRegisterRepository);
