"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
class Staff {
    constructor(staff_id, first_name, last_name, phone, created_by, email, payroll_category, is_active) {
        this.staff_id = staff_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone = phone;
        this.created_by = created_by;
        this.email = email;
        this.payroll_category = payroll_category;
        this.is_active = is_active;
    }
}
exports.Staff = Staff;
