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
exports.SMSService = void 0;
const inversify_1 = require("inversify");
const AppError_1 = require("../utils/AppError");
let SMSService = class SMSService {
    constructor() {
        this.apiKey = process.env.SMS_API_KEY || "";
        this.senderId = process.env.SMS_PARTNERID || "";
        this.apiUrlBulky = process.env.SMS_BULK_URL || "";
        this.shortCode = process.env.SMS_SHORTCODE || "";
        this.apiUrlSingle = process.env.SMS_URL || "";
        if (!this.apiKey || !this.senderId || !this.apiUrlBulky || !this.shortCode || !this.apiUrlSingle) {
            throw new AppError_1.AppError("SMS configuration is missing", 500);
        }
    }
    getHeaders() {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return headers;
    }
    sendBulky(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!to.length) {
                    throw new AppError_1.AppError("We could not get phone from your query, ensure phone numbers exist in the contact groups");
                }
                let count = to.length;
                const smslist = [];
                for (const phone of to) {
                    smslist.push({
                        apikey: this.apiKey,
                        partnerID: this.senderId,
                        message,
                        shortcode: this.shortCode,
                        mobile: phone,
                    });
                }
                const payload = {
                    count,
                    smslist,
                };
                console.log(payload);
                const requestOptions = {
                    method: "POST",
                    headers: this.getHeaders(),
                    body: JSON.stringify(payload),
                };
                const response = yield fetch(this.apiUrlBulky, requestOptions);
                if (!response.ok) {
                    throw new Error(`Failed to send bulky SMS. Status: ${response.status}`);
                }
                //console.log(await response.json())
                const result = yield response.json();
                return result;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to send bulky SMS: " + error, 500);
            }
        });
    }
    sendSingle(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    apikey: this.apiKey,
                    partnerID: this.senderId,
                    shortcode: this.shortCode,
                    mobile: to,
                    message: message,
                };
                const requestOptions = {
                    method: "POST",
                    headers: this.getHeaders(),
                    body: JSON.stringify(payload),
                };
                const response = yield fetch(this.apiUrlSingle, requestOptions);
                if (!response.ok) {
                    throw new Error(`Failed to send single SMS. Status: ${response.status}`);
                }
                const result = yield response.json();
                console.log(result.responses);
                return result.responses;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to send single SMS: " + error, 500);
            }
        });
    }
};
exports.SMSService = SMSService;
exports.SMSService = SMSService = __decorate([
    (0, inversify_1.injectable)()
], SMSService);
