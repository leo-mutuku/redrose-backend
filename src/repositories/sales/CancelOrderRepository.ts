import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";

import { ICancelledOrderRepository } from "../../interfaces/sales/ICancelledOrderRepository";
import { CancelledOrder } from "../../entities/sales/CancelledOrder";

@injectable()
export class CancelOrderRepository implements ICancelledOrderRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new cancel order record
    async createCancelledOrder({

    }: CancelledOrder): Promise<CancelledOrder> {
        try {
            const query = `
                INSERT INTO cancel_order (order_id, cancel_reason, canceled_by, cancel_date)
                VALUES ($1, $2, $3, $4)
                RETURNING cancel_order_id, order_id, cancel_reason, canceled_by, cancel_date, created_at
            `;
            const values = [];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating cancel order: ' + error, 500);
        }
    }

    // Get a list of canceled orders with pagination
    async getCancelledOrders(limit: number, offset: number): Promise<CancelledOrder[]> {
        try {
            const query = `
                SELECT cancel_order_id, order_id, cancel_reason, canceled_by, cancel_date, created_at
                FROM cancel_order
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching canceled orders: ' + error, 500);
        }
    }

    // Get a single canceled order by ID
    async getCancelledOrder(id: number): Promise<CancelledOrder> {
        try {
            const query = `
                SELECT cancel_order_id, order_id, cancel_reason, canceled_by, cancel_date, created_at
                FROM cancel_order
                WHERE cancel_order_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Cancel order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching cancel order: ' + error, 500);
        }
    }

    // Update an existing cancel order
    async updateCancelledOrder(id: number, cancelOrder: Partial<CancelledOrder>): Promise<CancelledOrder> {
        try {
            let query = `UPDATE cancel_order SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(cancelOrder).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE cancel_order_id = $${values.length + 1} RETURNING 
                cancel_order_id, order_id, cancel_reason, canceled_by, cancel_date, created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Cancel order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating cancel order: ' + error, 500);
        }
    }

    // Delete a canceled order by ID
    async deleteCancelledOrder(id: number): Promise<CancelledOrder> {
        try {
            const query = `
                DELETE FROM cancel_order
                WHERE cancel_order_id = $1
                RETURNING cancel_order_id, order_id, cancel_reason, canceled_by, cancel_date, created_at
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Cancel order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting cancel order: ' + error, 500);
        }
    }
}
