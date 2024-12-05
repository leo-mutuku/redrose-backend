import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";

import { IFoodProcessingRepository } from "../../interfaces/kitchen/IFoodProcessingRepository";
import { FoodProcessing } from "../../entities/kitchen/FoodProcessing";

@injectable()
export class FoodProcessingRepository implements IFoodProcessingRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createFoodProcessing({ food_item, user_id }: FoodProcessing): Promise<any> {
        try {


            //check  for duplicateentries in fooo_id kitchen_setup_id in the array object should be unique
            const duplicateEntries = food_item.reduce((acc, item) => {
                const key = `${item.kitchen_setup_id}`;
                if (!acc[key]) {
                    acc[key] = 1;
                } else {
                    acc[key]++;
                }
                return acc;
            }, {});
            if (Object.values(duplicateEntries).some((count: any) => count > 1)) {
                throw new AppError('Duplicate entries found in food_item entries', 400);
            }

            // prepare a list of ingredients base on kitchen setup id
            // store procedure to per the task after passing food_item array as parameter and return the list of ingredients



            // Convert food_item array to JSON
            const foodItemJson = JSON.stringify(food_item);

            // Prepare and execute the SQL query
            console.log(foodItemJson);
            const result = await this.client.query(
                ` SELECT * FROM get_kitchen_ingredients_by_setup_id(
                $1::JSON
            );`,
                [foodItemJson]
            );

            // Process the result convert to javascript 
            const ingredients = result.rows;
            console.log(ingredients);
            // Group by store_item_id and sum the quantities
            const groupedIngredients = Object.values(ingredients.reduce((acc, item) => {
                // Convert the quantity to a number for calculation
                const quantity = parseFloat(item.quantity);

                // Check if the store_item_id already exists in the accumulator
                if (!acc[item.store_item_id]) {
                    // If not, initialize it with the current item and store the ingredients_id
                    acc[item.store_item_id] = {
                        store_item_id: item.store_item_id,
                        ingredients_id: item.ingredients_id,  // Keep the first ingredients_id encountered
                        quantity: quantity
                    };
                } else {
                    // If exists, add the quantity to the existing item
                    acc[item.store_item_id].quantity += quantity;
                }

                return acc;
            }, {}));

            let store_itemsjson = JSON.stringify(groupedIngredients)

            const result2 = await this.client.query(
                ` SELECT update_store_item_quantities(
                $1::JSON
            );`,
                [store_itemsjson]
            );






        } catch (error) {
            throw new AppError('Error creating food processing entry: ' + error, 500);
        }
    }

    async getFoodProcessings(limit: number, offset: number): Promise<FoodProcessing[]> {
        try {
            const query = `
                SELECT process_id, process_name, description, 
                TO_CHAR(start_date, 'DD/MM/YYYY') AS start_date, 
                TO_CHAR(end_date, 'DD/MM/YYYY') AS end_date,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM food_processing
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching food processing entries: ' + error, 500);
        }
    }

    async getFoodProcessing(id: number): Promise<FoodProcessing> {
        try {
            const query = `
                SELECT process_id, process_name, description, 
                TO_CHAR(start_date, 'DD/MM/YYYY') AS start_date, 
                TO_CHAR(end_date, 'DD/MM/YYYY') AS end_date,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM food_processing
                WHERE process_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Food processing entry not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching food processing entry: ' + error, 500);
        }
    }

    async updateFoodProcessing(id: number, foodProcessing: Partial<FoodProcessing>): Promise<FoodProcessing> {
        try {
            let query = `UPDATE food_processing SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(foodProcessing).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE process_id = $${values.length + 1} RETURNING 
                process_id, process_name, description, 
                TO_CHAR(start_date, 'DD/MM/YYYY') AS start_date, 
                TO_CHAR(end_date, 'DD/MM/YYYY') AS end_date,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Food processing entry not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating food processing entry: ' + error, 500);
        }
    }
}
