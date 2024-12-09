import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IHotKitchenStoreRepository } from "../../interfaces/store/IHotKitchenStoreRepository";
import { HotKitchenStore } from "../../entities/store/HotKitchenStore";

@injectable()
export class HotKitchenStoreRepository implements IHotKitchenStoreRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createHotKitchenStore({ item_id, quantity, store_item_id }: HotKitchenStore): Promise<HotKitchenStore> {
        try {
            const query = `
                INSERT INTO hot_kitchen_store (item_id, quantity, store_item_id)
                VALUES ($1, $2, $3)
                RETURNING hot_kitchen_store_id, item_id, quantity, store_item_id,
                TO_CHAR(updated_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [item_id, quantity, store_item_id];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating hot kitchen store record: ' + error, 500);
        }
    }

    async getHotKitchenStores(limit: number, offset: number): Promise<HotKitchenStore[]> {
        try {
            const query = `
                SELECT hks.hot_kitchen_store_id, hks.item_id, ir.item_name, hks.quantity, hks.store_item_id,
                TO_CHAR(updated_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM hot_kitchen_store as hks
                inner join item_register as ir on hks.item_id = ir.item_id
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching hot kitchen store records: ' + error, 500);
        }
    }

    async getHotKitchenStore(id: number): Promise<HotKitchenStore> {
        try {
            const query = `
                SELECT hks.hot_kitchen_store_id, hks.item_id, ir.item_name, hks.quantity, hks.store_item_id,
                TO_CHAR(updated_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM hot_kitchen_store as hks
                inner join item_register as ir on hks.item_id = ir.item_id
                WHERE hks.hot_kitchen_store_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Hot kitchen store record not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching hot kitchen store record: ' + error, 500);
        }
    }

    async updateHotKitchenStore(id: number, store: Partial<HotKitchenStore>): Promise<HotKitchenStore> {
        try {
            let query = `UPDATE hot_kitchen_store SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(store).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE hot_kitchen_store_id = $${values.length + 1} RETURNING 
                item_id, quantity,  store_item_id,
                TO_CHAR(updated_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Hot kitchen store record not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating hot kitchen store record: ' + error, 500);
        }
    }
}
