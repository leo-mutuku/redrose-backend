"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemTracking = void 0;
class ItemTracking {
    constructor(item_tracking_id, item_id, initial_balance, current_balance, net_change, reason, action_by) {
        this.item_tracking_id = item_tracking_id;
        this.item_id = item_id;
        this.initial_balance = initial_balance;
        this.current_balance = current_balance;
        this.net_change = net_change;
        this.reason = reason;
        this.action_by = action_by;
    }
}
exports.ItemTracking = ItemTracking;
