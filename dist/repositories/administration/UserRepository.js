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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
const bcrypt_1 = __importDefault(require("bcrypt"));
let UserRepository = class UserRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, first_name, last_name, password, ttl, phone, roles }) {
            try {
                const saltRounds = 10; // Number of hashing rounds
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                const query = `INSERT INTO users (username, first_name, last_name, password, ttl, phone)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING 
            user_id, username, first_name, last_name, created_by, 
            TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at  `;
                const values = [username, first_name, last_name, hashedPassword, ttl, phone];
                const result = yield this.client.query(query, values);
                // create user roles
                const user_id = parseInt(result.rows[0].user_id);
                for (let role of roles !== null && roles !== void 0 ? roles : []) {
                    try {
                        const query2 = `
                        INSERT INTO user_roles (user_id, role_id) 
                        VALUES ($1, $2)
                        RETURNING user_id, role_id;
                    `;
                        const values2 = [user_id, role];
                        const result2 = yield this.client.query(query2, values2);
                    }
                    catch (error) {
                        throw new AppError_1.AppError('Error creating user role ' + error, 500);
                    }
                }
                return Object.assign(Object.assign({}, result.rows[0]), { roles });
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating user ' + error);
            }
        });
    }
    getUsers(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT user_id, username, first_name, last_name, created_by, 
            TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at FROM users WHERE is_active = true LIMIT $1 OFFSET $2`;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new Error('Error fetching users ' + error);
            }
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT  user_id, username, first_name, last_name, created_by,  is_active,
            TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at FROM users  WHERE user_id = $1`;
                const values = [id];
                const result = yield this.client.query(query, values);
                const roles = yield this.client.query(`SELECT role_id  FROM user_roles WHERE user_id = $1`, [id]);
                const user_roles = roles.rows.map((row) => row.role_id);
                let role_array = [];
                for (let role of user_roles) {
                    const role_name_result = yield this.client.query(`SELECT role_name, role_id FROM roles WHERE role_id = $1`, [role]);
                    // Check if the query returned a result
                    if (role_name_result.rows.length > 0) {
                        const name = role_name_result.rows[0].role_name;
                        const id = role_name_result.rows[0].role_id;
                        role_array.push({ name, id });
                        console.log(role_array);
                    }
                    else {
                        console.warn(`Role with role_id ${role} does not exist.`);
                    }
                }
                return Object.assign(Object.assign({}, result.rows[0]), { roles: role_array });
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching user ' + error);
            }
        });
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Initialize query parts
                let query = `UPDATE users SET `;
                const values = [];
                let setClauses = [];
                // Prevent updating user_id
                if ('user_id' in user) {
                    throw new AppError_1.AppError('Updating user_id is not allowed');
                }
                // Dynamically build the SET clause and values array
                Object.entries(user).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                // update roles  check if role exist in user_roles table
                // Ensure at least one field to update
                if (setClauses.length === 0) {
                    throw new Error('No fields to update');
                }
                // Add WHERE clause and RETURNING statement
                query += setClauses.join(', ');
                query += ` WHERE user_id = $${values.length + 1} RETURNING 
                user_id, username, first_name, last_name, created_by, is_active,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;
                // Add user ID to the values array
                values.push(id);
                // Execute the query
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('User not found', 400);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating user ' + error, 400);
            }
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)()
], UserRepository);
