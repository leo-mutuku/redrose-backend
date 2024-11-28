export class StoreItems {
    constructor(
        public readonly store_item_id: number,
        public readonly store_id: string,
        public readonly item_id: number,
        public readonly quantity: number,
    ) { }
}