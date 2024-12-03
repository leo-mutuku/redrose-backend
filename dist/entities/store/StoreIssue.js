"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreIssue = void 0;
class StoreIssue {
    constructor(issue_date, description, issued_by, // staff_id
    created_by, status, isssue_list, created_at) {
        this.issue_date = issue_date;
        this.description = description;
        this.issued_by = issued_by;
        this.created_by = created_by;
        this.status = status;
        this.isssue_list = isssue_list;
        this.created_at = created_at;
    }
}
exports.StoreIssue = StoreIssue;
