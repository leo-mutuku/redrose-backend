"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRegister = void 0;
class ItemRegister {
    constructor(item_id, item_name, item_description, created_by, created_at, created_by_name) {
        this.item_id = item_id;
        this.item_name = item_name;
        this.item_description = item_description;
        this.created_by = created_by;
        this.created_at = created_at;
        this.created_by_name = created_by_name;
    }
}
exports.ItemRegister = ItemRegister;
