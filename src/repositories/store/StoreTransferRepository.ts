import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IStoreTransferRepository } from "../../interfaces/store/IStoreTransferRepository";
import { StoreTransfer } from "../../entities/store/StoreTransfer";

@injectable()
export class StoreTransferRepository implements IStoreTransferRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createStoreTransfer({ store_item_id, quantity, transfer_type, destination_store_item_id }: StoreTransfer): Promise<any> {
        try {
            // Prepare JSON payload
            const store_item_json = JSON.stringify([{ store_item_id, quantity, transfer_type, destination_store_item_id }]);
            console.log('Store item JSON:', store_item_json);
            // validate the item_id match in the select store

            // case 1 for RESTAURANT type
            if (transfer_type == "RESTAURANT") {
                let qry1 = `select * from store_item where store_item_id = $1 `;
                let qry2 = `select * from restaurant_store where store_item_id = $1 `;
                let result1 = await this.client.query(qry1, [store_item_id]);
                let result2 = await this.client.query(qry2, [destination_store_item_id]);
                if (!result1.rows.length || !result2.rows.length) {
                    throw new AppError('Item mismatch in the selected stores', 404);

                }

                if (result1.rows[0].quantity < quantity) {
                    throw new AppError('Insufficient quantity in the selected store', 404);
                }
                if (result1.rows[0].item_id != result2.rows[0].item_id) {
                    throw new AppError('Item mismatch in the selected stores', 404);
                }

            }

            // case 2 for KITCHEN type
            if (transfer_type == "KITCHEN") {
                let qry1 = `select * from store_item where store_item_id = $1 `;
                let qry2 = `select * from kitchen_store where store_item_id = $1 `;
                let result1 = await this.client.query(qry1, [store_item_id]);
                let result2 = await this.client.query(qry2, [destination_store_item_id]);
                if (!result1.rows.length || !result2.rows.length) {
                    throw new AppError('Item mismatch in the selected stores', 404);

                }

                if (result1.rows[0].quantity < quantity) {
                    throw new AppError('Insufficient quantity in the selected store', 404);
                }
                if (result1.rows[0].item_id != result2.rows[0].item_id) {
                    throw new AppError('Item mismatch in the selected stores', 404);
                }

            }
            // Call the stored procedure directly
            const query = `
                select * from  store_transfer_procedure($1::JSON);
            `;
            const values = [store_item_json];

            // Execute the query
            let result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            console.error('Error during store transfer:', error);
            throw new AppError('Error creating store transfer record: ' + error, 500);
        }
    }

    async getStoreTransfers(limit: number, offset: number): Promise<StoreTransfer[]> {
        try {
            const query = `
           SELECT 
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
WHERE 
    t.reason = 'Transfer to kitchen'
	order by t.item_tracking_id desc;

            `;
            const values = [limit, offset];
            const result = await this.client.query(query);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching store transfer records: ' + error, 500);
        }
    }

    async getStoreTransfer(id: number): Promise<StoreTransfer> {
        try {
            const query = `
                SELECT transfer_id, transfer_date, source_store_id, destination_store_id, item_name, quantity, transferred_by, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM store_transfer
                WHERE transfer_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Store transfer record not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching store transfer record: ' + error, 500);
        }
    }

    async updateStoreTransfer(id: number, transfer: Partial<StoreTransfer>): Promise<StoreTransfer> {
        try {
            let query = `UPDATE store_transfer SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(transfer).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE transfer_id = $${values.length + 1} RETURNING 
                transfer_id, transfer_date, source_store_id, destination_store_id, item_name, quantity, transferred_by, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Store transfer record not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating store transfer record: ' + error, 500);
        }
    }
}
