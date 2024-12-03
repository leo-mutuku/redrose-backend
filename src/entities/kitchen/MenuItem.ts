export class MenuItem {
    constructor(
        public readonly menu_register_id: number,
        public readonly quantity: number,
        public readonly menu_category_id: number,
        public readonly available: boolean,
        public readonly price: number

    ) { }
}