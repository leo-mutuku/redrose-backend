import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";

import { IKitchenSetupRepository } from "../../interfaces/kitchen/IKitchenSetupRepository";
import { KitchenSetup } from "../../entities/kitchen/KitchenSetup";

@injectable()
export class KitchenSetupRepository implements IKitchenSetupRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }
    async createKitchenSetup({ station_id, menu_item_id, managed, ingredients_value }: KitchenSetup): Promise<any> {
        try {


            if (managed == 'MANAGED') {


                if (!station_id) {
                    throw new AppError('Station ID is required', 400);
                }
                if (!menu_item_id) {
                    throw new AppError('Menu item ID is required', 400);
                }


                if (!ingredients_value.length) {
                    throw new AppError('Ingredient value is required', 400);
                }

                //  get menu name from menu_register
                const menu_register_query = `select mr.name from menu_register as mr
            inner join menu_item as mi on mr.menu_register_id = mi.menu_register_id
             where mi.menu_item_id = $1`;

                const menu_register_values = [menu_item_id];
                const menu_register_result = await this.client.query(menu_register_query, menu_register_values);

                // get menu_name from menu_register
                const menu_name = menu_register_result.rows[0].name;


                // insert into kitchen_setup
                const query = `
                INSERT INTO kitchen_setup (station_id, menu_item_id, name, managed)
                VALUES ($1, $2, $3, $4
                
                
                )
                RETURNING kitchen_setup_id, station_id, menu_item_id, name,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
                const values = [station_id, menu_item_id, menu_name, managed];
                const result = await this.client.query(query, values);

                // the kitchen setup id becomes the ingredients id
                const ingredient_id = parseInt(result.rows[0].kitchen_setup_id)

                // insert kitchen ingredients
                for (let item of ingredients_value) {
                    const kitchen_ingredients_query = `insert into kitchen_ingredients (ingredients_id, store_item_id, quantity, source_type) values ($1, $2, $3,$4)`;
                    const kitchen_ingredients_values = [ingredient_id, item.ingredients_id, item.quantity, item.source_type];
                    await this.client.query(kitchen_ingredients_query, kitchen_ingredients_values);

                    // validate if the specified source_type exist if not throw an error and roll back
                }
                return result.rows[0];
            }

            if (managed == 'UNMANAGED') {
                const query = `select * from kitchen_setup where menu_item_id = $1`;
                const values = [menu_item_id];
                const result = await this.client.query(query, values);
                if (result.rows.length > 0) {
                    throw new AppError('Menu item already exists', 400);
                }
                // get menu name from menu_register
                const menu_register_query = `select mr.name from menu_register as mr 
                inner join menu_item as mi on mr.menu_register_id = mi.menu_register_id
                where mi.menu_item_id = $1`;
                const menu_register_values = [menu_item_id];
                const menu_register_result = await this.client.query(menu_register_query, menu_register_values);
                // get menu_name from menu_register
                const menu_name = menu_register_result.rows[0].name;
                // insert into kitchen_setup
                const query1 = ` insert into kitchen_setup (station_id, menu_item_id, name, managed)
                VALUES ($1, $2, $3, $4)
                RETURNING kitchen_setup_id, station_id, menu_item_id, name,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`
                const values1 = [station_id, menu_item_id, menu_name, 'UNMANAGED'];
                const result1 = await this.client.query(query1, values1);
                // the kitchen setup id becomes the ingredients id
                result1.rows
            }
        } catch (error) {
            throw new AppError('Error creating kitchen setup: ' + error, 500);
        }
    }

    async getKitchenSetups(limit: number, offset: number): Promise<KitchenSetup[]> {
        try {

            const query = `
                           SELECT 
    ks.kitchen_setup_id, 
    ks.name, 
    ks.menu_item_id, 
    ks.managed,
    TO_CHAR(ks.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'ingredient_id', ki.ingredient_id,
				'ingredients_id', ki.ingredients_id,
                'store_item_id', ki.store_item_id,
                'source_type', ki.source_type,
                'item_id', si.item_id,
                'item_name', ir.item_name,
                'quantity', ki.quantity
            )
        ) FILTER (WHERE ki.ingredient_id IS NOT NULL),
        '[]'
    ) AS ingredients_value
FROM 
    kitchen_setup ks
LEFT JOIN 
    kitchen_ingredients ki 
    ON ks.kitchen_setup_id = ki.ingredients_id
LEFT JOIN 
    store_item si 
    ON ki.store_item_id = si.store_item_id
LEFT JOIN 
    item_register ir 
    ON si.item_id = ir.item_id
GROUP BY 
    ks.kitchen_setup_id

                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching kitchen setups: ' + error, 500);
        }
    }

    async getKitchenSetup(id: number): Promise<KitchenSetup> {
        try {
            const query = `
                SELECT 
    ks.kitchen_setup_id, 
    ks.name, 
    ks.menu_item_id, 
    TO_CHAR(ks.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'ingredient_id', ki.ingredient_id,
                'ingredients_id', ki.ingredients_id,
                'store_item_id', ki.store_item_id,
                'item_id', si.item_id,
                'item_name', ir.item_name,
                'quantity', ki.quantity
            )
        ) FILTER (WHERE ki.ingredient_id IS NOT NULL),
        '[]'
    ) AS ingredients_value
FROM 
    kitchen_setup ks
LEFT JOIN 
    kitchen_ingredients ki 
    ON ks.kitchen_setup_id = ki.ingredients_id
LEFT JOIN 
    store_item si 
    ON ki.store_item_id = si.store_item_id
LEFT JOIN 
    item_register ir 
    ON si.item_id = ir.item_id
WHERE 
    ks.kitchen_setup_id = $1
GROUP BY 
    ks.kitchen_setup_id
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Kitchen setup not found', 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching kitchen setup: ' + error, 500);
        }
    }

    async updateKitchenSetup(id: number, kitchenSetup: Partial<KitchenSetup>): Promise<KitchenSetup> {
        try {
            let query = `UPDATE kitchen_setup SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(kitchenSetup).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE kitchen_setup_id = $${values.length + 1} RETURNING 
                kitchen_setup_id, setup_name, setup_description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Kitchen setup not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating kitchen setup: ' + error, 500);
        }
    }
}
