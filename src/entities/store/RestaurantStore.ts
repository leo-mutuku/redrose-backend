export class RestaurantStore {
    constructor(
        public readonly item_id: number,
        public readonly quantity: number,
        public readonly store_id: number,
        public readonly store_item_id: number,

    ) { }
}