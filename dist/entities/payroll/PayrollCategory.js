"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollCategory = void 0;
class PayrollCategory {
    constructor(id, name, amount, type, created_at, updated_at) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.type = type;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
exports.PayrollCategory = PayrollCategory;
