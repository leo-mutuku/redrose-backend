import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IRestaurantStoreRepository } from "../../interfaces/store/IRestaurantStoreRepository";
import { RestaurantStore } from "../../entities/store/RestaurantStore";

@injectable()
export class RestaurantStoreRepository implements IRestaurantStoreRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createRestaurantStore({ item_id, quantity, store_id, store_item_id }: RestaurantStore): Promise<RestaurantStore> {
        try {
            const query = `
                INSERT INTO restaurant_store (item_id, quantity, store_id, store_item_id)
                VALUES ($1, $2, $3, $4)
                RETURNING restaurant_store_item_id, item_id, quantity, store_id, store_item_id,
                TO_CHAR(updated_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [item_id, quantity, store_id, store_item_id];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating restaurant store record: ' + error, 500);
        }
    }

    async getRestaurantStores(limit: number, offset: number): Promise<RestaurantStore[]> {
        try {
            const query = `
                SELECT rs.restaurant_store_item_id, rs.item_id, ir.item_name,
                 rs.quantity, rs.store_item_id, sr.store_name,sr.store_id,
                TO_CHAR(updated_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM restaurant_store as rs
                INNER JOIN item_register as ir ON rs.item_id = ir.item_id
                 INNER JOIN store_register as sr ON rs.store_id = sr.store_id 
              
            `;
            const values = [limit, offset];
            const result = await this.client.query(query);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching restaurant store records: ' + error, 500);
        }
    }

    async getRestaurantStore(id: number): Promise<RestaurantStore> {
        try {
            const query = `
                SELECT rs.restaurant_store_item_id, rs.item_id, ir.item_name, 
                rs.quantity, rs.store_item_id, sr.store_name,sr.store_id,
                TO_CHAR(updated_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM restaurant_store as rs
                INNER JOIN item_register as ir ON rs.item_id = ir.item_id
                INNER JOIN store_register as sr ON rs.store_id = sr.store_id 
                WHERE rs.restaurant_store_item_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Restaurant store record not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching restaurant store record: ' + error, 500);
        }
    }

    async getRestaurantTracking() {
        try {
            const query = `
                SELECT 
                    rt.store_item_id,
                    ir.item_name,
                    ir.item_id,
                    rt.current_quantity,
                    rt.new_quantity,
                    rt.reason
                FROM 
                    restaurant_tracking rt
                LEFT JOIN 
                    store_item si ON rt.store_item_id = si.store_item_id
                LEFT JOIN 
                    item_register ir ON si.item_id = ir.item_id
                ORDER BY 
                    rt.restaurant_tracking_id DESC
            `;
            const result = await this.client.query(query);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching restaurant tracking records: ' + error, 500);
        }
    }

    async updateRestaurantStore(id: number, store: Partial<RestaurantStore>): Promise<RestaurantStore> {
        try {
            // Only allow the `quantity` field to be updated
            const allowedFields = ['quantity'];
            const values: any[] = [];
            const setClauses: string[] = [];

            // Filter the `store` object to only include the `quantity` field
            Object.entries(store).forEach(([key, value], index) => {
                if (allowedFields.includes(key)) {
                    setClauses.push(`${key} = $${values.length + 1}`);
                    values.push(value);
                }
            });

            if (setClauses.length === 0) {
                throw new AppError('No valid fields to update', 400);
            }

            let query = `UPDATE restaurant_store SET `;
            query += setClauses.join(', ');
            query += ` WHERE restaurant_store_item_id = $${values.length + 1} RETURNING 
                item_id, quantity, store_item_id,
                TO_CHAR(updated_at, 'DD/MM/YYYY : HH12:MI AM') AS updated_at`;

            values.push(id);

            console.log(query);

            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Restaurant store record not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating restaurant store record: ' + error, 500);
        }
    }


    async deleteRestaurantStore(id: number): Promise<void> {
        try {

            const query = `
                DELETE FROM restaurant_store
                WHERE restaurant_store_item_id = $1
            `;
            const values = [id];
            await this.client.query(query, values);
        } catch (error) {
            throw new AppError('Error deleting restaurant store record: ' + error, 500);
        }
    }
}
