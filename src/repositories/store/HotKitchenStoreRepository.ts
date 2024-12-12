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

    async createHotKitchenStore({ item_id, quantity, store_id, store_item_id }: HotKitchenStore): Promise<HotKitchenStore> {
        try {
            const query = `
                INSERT INTO kitchen_store (item_id, quantity, store_id, store_item_id)
                VALUES ($1, $2, $3, $4)
                RETURNING kitchen_store_item_id, item_id, quantity,store_id, store_item_id,
                TO_CHAR(updated_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [item_id, quantity, store_id, store_item_id];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating hot kitchen store record: ' + error, 500);
        }
    }

    async getHotKitchenStores(limit: number, offset: number): Promise<HotKitchenStore[]> {
        try {
            const query = `
                SELECT hks.kitchen_store_item_id, hks.item_id, ir.item_name, 
                hks.quantity, hks.store_item_id,sr.store_name,sr.store_id,
                TO_CHAR(updated_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM kitchen_store as hks
                inner join item_register as ir on hks.item_id = ir.item_id
                 INNER JOIN store_register as sr ON sr.store_id = hks.store_id 
             
            `;
            const values = [limit, offset];
            const result = await this.client.query(query);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching hot kitchen store records: ' + error, 500);
        }
    }

    async getHotKitchenStore(id: number): Promise<HotKitchenStore> {
        try {
            const query = `
                SELECT hks.kitchen_store_item_id, hks.item_id, ir.item_name,
                 hks.quantity, hks.store_item_id, sr.store_name,sr.store_id,
                TO_CHAR(updated_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM kitchen_store as hks
                inner join item_register as ir on hks.item_id = ir.item_id
                 INNER JOIN store_register as sr ON sr.store_id = hks.store_id 
                WHERE hks.kitchen_store_item_id = $1
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

    async getKitchenTracking() {
        try {
            const qry = `SELECT 
    ht.store_item_id,
    ir.item_name,
    ir.item_id,
    ht.current_quantity,
    ht.new_quantity,
	ht.reason
FROM 
    hot_kitchen_tracking ht
LEFT JOIN 
    store_item si ON ht.store_item_id = si.store_item_id  -- Corrected join condition
LEFT JOIN 
    item_register ir ON si.item_id = ir.item_id  -- Corrected join condition
ORDER BY 
    ht.hot_kitchen_tracking_id DESC`
            const res = await this.client.query(qry)

            return res.rows
        } catch (error) {

        }
    }
    async updateHotKitchenStore(id: number, store: Partial<HotKitchenStore>): Promise<HotKitchenStore> {
        try {
            let query = `UPDATE kitchen_store SET `;
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
            query += ` WHERE kitchen_store_item_id = $${values.length + 1} RETURNING 
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
    async deleteHotKitchenStore(id: number): Promise<void> {
        try {
            const query = `
                DELETE FROM kitchen_store
                WHERE kitchen_store_item_id = $1
            `;
            const values = [id];
            await this.client.query(query, values);
            return
        }
        catch (error) {
            throw new AppError('Error deleting hot kitchen store record: ' + error, 500);
        }
    }
}
