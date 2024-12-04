"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItem = void 0;
class MenuItem {
    constructor(menu_register_id, quantity, menu_category_id, available, price) {
        this.menu_register_id = menu_register_id;
        this.quantity = quantity;
        this.menu_category_id = menu_category_id;
        this.available = available;
        this.price = price;
    }
}
exports.MenuItem = MenuItem;
