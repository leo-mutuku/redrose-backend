export class FoodProcessing {
    constructor(
        public readonly food_item: FoodItem[],
        public readonly user_id: number,
    ) {

    }
}

type FoodItem = {
    kitchen_setup_id: number;
    quantity: number;
}
