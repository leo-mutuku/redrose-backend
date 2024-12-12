export class StoreTransfer {
    constructor(
        public readonly store_item_id: number,
        public readonly quantity: number,
        public readonly reason: string,
        public readonly transfer_type: 'KITCHEN' | 'RESTAURANT',
        public readonly destination_store_item_id?: number,
    ) { }
}