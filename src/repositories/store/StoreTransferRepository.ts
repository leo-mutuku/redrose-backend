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

    async createStoreTransfer({ }: StoreTransfer): Promise<StoreTransfer> {
        try {
            const query = `
                INSERT INTO store_transfer (transfer_date, source_store_id, destination_store_id, item_name, quantity, transferred_by)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING transfer_id, transfer_date, source_store_id, destination_store_id, item_name, quantity, transferred_by, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating store transfer record: ' + error, 500);
        }
    }

    async getStoreTransfers(limit: number, offset: number): Promise<StoreTransfer[]> {
        try {
            const query = `
                SELECT transfer_id, transfer_date, source_store_id, destination_store_id, item_name, quantity, transferred_by, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM store_transfer
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

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
