"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreItem = void 0;
class StoreItem {
    constructor(store_item_id, store_id, store_name, item_id, item_name, unit_id, unit_name_std, unit_name_value_std, unit_name_other, unit_name_value_other, quantity, selling_price, buying_price, item_unit, item_status, item_category) {
        this.store_item_id = store_item_id;
        this.store_id = store_id;
        this.store_name = store_name;
        this.item_id = item_id;
        this.item_name = item_name;
        this.unit_id = unit_id;
        this.unit_name_std = unit_name_std;
        this.unit_name_value_std = unit_name_value_std;
        this.unit_name_other = unit_name_other;
        this.unit_name_value_other = unit_name_value_other;
        this.quantity = quantity;
        this.selling_price = selling_price;
        this.buying_price = buying_price;
        this.item_unit = item_unit;
        this.item_status = item_status;
        this.item_category = item_category;
    }
}
exports.StoreItem = StoreItem;
