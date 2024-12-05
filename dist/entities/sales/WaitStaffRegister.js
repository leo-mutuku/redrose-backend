"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitStaffRegister = void 0;
class WaitStaffRegister {
    constructor(waitStaffRegisterId, staffId, registerTime, tableAssigned, createdBy, createdAt) {
        this.waitStaffRegisterId = waitStaffRegisterId;
        this.staffId = staffId;
        this.registerTime = registerTime;
        this.tableAssigned = tableAssigned;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }
}
exports.WaitStaffRegister = WaitStaffRegister;
