import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { StoreItem } from "../../entities/store/StoreItem"; // Assuming you have a StoreItem entity
import { IStoreItemRepository } from "../../interfaces/store/IStoreItemRepository";

@injectable()
export class StoreItemRepository implements IStoreItemRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new store item
    async createStoreItem({ store_id, item_id, quantity,
        buying_price, item_unit_id, item_category }: StoreItem): Promise<StoreItem> {
        try {

            const query = `
                INSERT INTO store_item (store_id, item_id, quantity,  buying_price, item_unit_id, item_category)
VALUES ($1, $2, $3, $4, $5, $6 )
RETURNING 
    store_item_id,
    store_id, 
    item_id, 
    quantity, 
    buying_price, 
    item_unit_id, 
    item_category,
    TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    (SELECT item_name FROM item_register WHERE item_id = store_item.item_id) AS item_name,
    (SELECT category_name from item_category where category_id = store_item.item_category) As category_name,
    (SELECT store_name FROM store_register WHERE store_id = store_item.store_id) AS store_name,
    (SELECT standard_unit_name from item_unit where unit_id = store_item.item_unit_id) AS unit_name;

    
        

            `;
            const values = [store_id,
                item_id, quantity, buying_price, item_unit_id, item_category];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating store item: ' + error, 500);
        }
    }

    // Get all store items with pagination
    async getStoreItems(limit: number, offset: number): Promise<StoreItem[]> {
        try {
            const query = `
               SELECT 
    si.store_item_id,
    si.store_id, 
    si.item_id, 
    si.quantity, 
    si.buying_price, 
    si.item_unit_id, 
    si.item_category,
    TO_CHAR(si.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    ir.item_name,
    ic.category_name,
    sr.store_name,
    iu.standard_unit_name AS unit_name
FROM store_item si
LEFT JOIN item_register ir ON ir.item_id = si.item_id
LEFT JOIN item_category ic ON ic.category_id = si.item_category
LEFT JOIN store_register sr ON sr.store_id = si.store_id
LEFT JOIN item_unit iu ON iu.unit_id = si.item_unit_id

            `;

            const result = await this.client.query(query);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching store items: ' + error, 500);
        }
    }

    // Get a specific store item by ID
    async getStoreItem(id: number): Promise<StoreItem> {
        try {
            const query = `
                   SELECT 
    si.store_item_id,
    si.store_id, 
    si.item_id, 
    si.quantity, 
    si.buying_price, 
    si.item_unit_id, 
    si.item_category,
    TO_CHAR(si.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    ir.item_name,
    ic.category_name,
    sr.store_name,
    iu.standard_unit_name AS unit_name
FROM store_item si
LEFT JOIN item_register ir ON ir.item_id = si.item_id
LEFT JOIN item_category ic ON ic.category_id = si.item_category
LEFT JOIN store_register sr ON sr.store_id = si.store_id
LEFT JOIN item_unit iu ON iu.unit_id = si.item_unit_id
WHERE si.store_item_id = $1
LIMIT 1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Store item not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching store item: ' + error, 500);
        }
    }

    async getItemtracking() {
        const query = `SELECT 
    t.store_item_id,
    ir.item_name,
    ir.item_id,
    t.current_quantity,
    t.new_quantity,
	t.reason
FROM 
    item_tracking t
LEFT JOIN 
    store_item s ON t.store_item_id = s.store_item_id
LEFT JOIN 
    item_register ir ON s.item_id = ir.item_id

ORDER BY 
    t.item_tracking_id ASC;  
`

        const result = await this.client.query(query)
        return result.rows

    }
    // Update a store item by its ID
    async updateStoreItem(id: number, item: Partial<StoreItem>): Promise<StoreItem> {
        try {
            let query = `UPDATE store_item SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(item).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE store_item_id = $${values.length + 1} 
                   RETURNING 
    store_item_id,
    store_id, 
    item_id, 
    quantity, 
    buying_price, 
    item_unit_id, 
    item_category,
    TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    (SELECT item_name FROM item_register WHERE item_id = store_item.item_id) AS item_name,
    (SELECT category_name from item_category where category_id = store_item.item_category) As category_name,
    (SELECT store_name FROM store_register WHERE store_id = store_item.store_id) AS store_name,
    (SELECT standard_unit_name from item_unit where unit_id = store_item.item_unit_id) AS unit_name
                    `;
            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Store item not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating store item: ' + error, 500);
        }
    }

    async deleteStoreItem(id: number): Promise<void> {
        try {
            const query = 'DELETE FROM store_item WHERE store_item_id = $1';
            const values = [id];
            const result = await this.client.query(query, values);
            if (result.rowCount === 0) {
                throw new AppError('Store item not found', 404);
            }
        }
        catch (error) {
            throw new AppError('Error deleting store item: ' + error, 500);
        }
    }
}
