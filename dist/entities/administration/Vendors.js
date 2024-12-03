"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = void 0;
class Vendor {
    constructor(vendor_name, phone, balance, vendor_id, is_active, created_by, created_at) {
        this.vendor_name = vendor_name;
        this.phone = phone;
        this.balance = balance;
        this.vendor_id = vendor_id;
        this.is_active = is_active;
        this.created_by = created_by;
        this.created_at = created_at;
    }
}
exports.Vendor = Vendor;
