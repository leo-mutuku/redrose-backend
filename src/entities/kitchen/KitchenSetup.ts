export class KitchenSetup {
    constructor(
        public readonly station_id: number,
        public readonly menu_item_id: number,
        public readonly ingredients_value: IngredientValue[],

    ) { }
}

type IngredientValue = {
    ingredients_id: number,
    quantity: number,
    source_type: 'MAIN_STORE' | 'HOT_KITCHEN',
}