export class KitchenSetup {
    constructor(
        public readonly station_id: number,
        public readonly menu_item_id: number,
        public readonly ingredients_value: IngredientValue[],

    ) { }
}

type IngredientValue = {
    store_item_id: number,
    quantity: number
}