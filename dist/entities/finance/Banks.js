"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bank = void 0;
class Bank {
    constructor(bank_name, bank_number, balance, created_by, bank_id, created_at) {
        this.bank_name = bank_name;
        this.bank_number = bank_number;
        this.balance = balance;
        this.created_by = created_by;
        this.bank_id = bank_id;
        this.created_at = created_at;
    }
}
exports.Bank = Bank;
