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
exports.SMSRepository = void 0;
const dbConnection_1 = require("../dbConnection");
const inversify_1 = require("inversify");
const AppError_1 = require("../utils/AppError");
let SMSRepository = class SMSRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    getPhoneNumbers(target) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const phoneNumbers = [];
                // Helper function to fetch phone numbers from a table.
                const fetchPhoneNumbers = (tableName) => __awaiter(this, void 0, void 0, function* () {
                    const query = `
                SELECT phone 
                FROM ${tableName} 
                WHERE phone IS NOT NULL 
                  AND LENGTH(phone) = 10 
                  AND phone ~ '^[0-9]+$'
            `;
                    const result = yield this.client.query(query); // Use your database client here.
                    return result.rows.map((row) => row.phone);
                });
                // Fetch phone numbers based on the target array.
                for (const table of target) {
                    if (["suppliers", "vendors", "staff"].includes(table)) {
                        const tablePhoneNumbers = yield fetchPhoneNumbers(table);
                        phoneNumbers.push(...tablePhoneNumbers);
                    }
                    else {
                        console.warn(`Table ${table} is not supported.`);
                        throw new Error(`Table ${table} is not supported.`);
                    }
                }
                const uniquePhoneNumbers = Array.from(new Set(phoneNumbers));
                return uniquePhoneNumbers;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get phone numbers" + error, 500);
            }
        });
    }
};
exports.SMSRepository = SMSRepository;
exports.SMSRepository = SMSRepository = __decorate([
    (0, inversify_1.injectable)()
], SMSRepository);
