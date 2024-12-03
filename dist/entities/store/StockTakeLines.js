"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockTakeLines = void 0;
class StockTakeLines {
    constructor(stock_take_id, item_code, physical_quantity, system_quantity, variance) {
        this.stock_take_id = stock_take_id;
        this.item_code = item_code;
        this.physical_quantity = physical_quantity;
        this.system_quantity = system_quantity;
        this.variance = variance;
    }
}
exports.StockTakeLines = StockTakeLines;
