export class StockTakeLines {
    constructor(
        public readonly stock_take_id: number,
        public readonly item_code: number,
        public readonly physical_quantity: number,
        public readonly system_quantity: number,
        public readonly variance: number,
    ) { }
}