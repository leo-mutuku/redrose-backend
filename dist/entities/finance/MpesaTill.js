"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MpesaTill = void 0;
class MpesaTill {
    constructor(mpesa_till_name, balance, created_by, mpesa_till_id, created_at) {
        this.mpesa_till_name = mpesa_till_name;
        this.balance = balance;
        this.created_by = created_by;
        this.mpesa_till_id = mpesa_till_id;
        this.created_at = created_at;
    }
}
exports.MpesaTill = MpesaTill;
