"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashierRegister = void 0;
class CashierRegister {
    constructor(staff_id, balance, pin, created_by) {
        this.staff_id = staff_id;
        this.balance = balance;
        this.pin = pin;
        this.created_by = created_by;
    }
}
exports.CashierRegister = CashierRegister;
