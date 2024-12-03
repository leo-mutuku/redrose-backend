"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supplier = void 0;
class Supplier {
    constructor(supplier_name, phone, balance, supplier_id, is_active, created_by, created_at) {
        this.supplier_name = supplier_name;
        this.phone = phone;
        this.balance = balance;
        this.supplier_id = supplier_id;
        this.is_active = is_active;
        this.created_by = created_by;
        this.created_at = created_at;
    }
}
exports.Supplier = Supplier;
