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
exports.WaitStaffRegisterRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let WaitStaffRegisterRepository = class WaitStaffRegisterRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    // Create a new wait staff registration
    createWaitStaffRegister(_a) {
        return __awaiter(this, arguments, void 0, function* ({ staff_id, balance, pin, created_by }) {
            try {
                const query = `
                INSERT INTO waitstaff ( staff_id,
        balance,
        pin,created_by)
                VALUES ($1, $2, $3, $4)
                RETURNING waitstaff_id, staff_id,
        balance,
        pin, created_by, created_at
            `;
                const values = [staff_id,
                    balance,
                    pin, created_by,];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating wait staff registration: ' + error, 500);
            }
        });
    }
    // Get a list of wait staff registrations with pagination
    getWaitStaffRegisters(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                        SELECT 
                ws.waitstaff_id,
                ws.staff_id, 
                ws.balance,  
                ws.created_by, 
                ws.created_at,
                s.first_name || ' ' || s.last_name AS waitstaff_name
            FROM 
                waitstaff AS ws
            INNER JOIN 
                staff AS s 
            ON 
                ws.staff_id = s.staff_id
            LIMIT $1 OFFSET $2
            `;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching wait staff registrations: ' + error, 500);
            }
        });
    }
    // Get a single wait staff registration by ID
    getWaitStaffRegister(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                 SELECT 
    ws.waitstaff_id,
    ws.staff_id, 
    ws.balance,  
    ws.created_by, 
    ws.created_at,
    s.first_name || ' ' || s.last_name AS waitstaff_name
FROM 
    waitstaff AS ws
INNER JOIN 
    staff AS s 
ON 
    ws.staff_id = s.staff_id
    WHERE ws.waitstaff_id = $1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Wait staff registration not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching wait staff registration: ' + error, 500);
            }
        });
    }
    // Update an existing wait staff registration
    updateWaitStaffRegister(id, waitStaffRegister) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE waitstaff SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(waitStaffRegister).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE waitstaff_id = $${values.length + 1} RETURNING 
                waitstaff, staff_id, balance, created_by, created_at`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Wait staff registration not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating waitstaff: ' + error, 500);
            }
        });
    }
    // Delete a wait staff registration by ID
    deleteWaitStaffRegister(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM wait_staff_register
                WHERE wait_staff_register_id = $1
                RETURNING wait_staff_register_id, staff_id, register_time, table_assigned, created_by, created_at
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Wait staff registration not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error deleting wait staff registration: ' + error, 500);
            }
        });
    }
};
exports.WaitStaffRegisterRepository = WaitStaffRegisterRepository;
exports.WaitStaffRegisterRepository = WaitStaffRegisterRepository = __decorate([
    (0, inversify_1.injectable)()
], WaitStaffRegisterRepository);
