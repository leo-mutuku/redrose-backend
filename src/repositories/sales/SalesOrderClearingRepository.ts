import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { SalesOrderClearing } from "../../entities/sales/SalesOrderClearing";
import { ISalesOrderClearingRepository } from "../../interfaces/sales/ISalesOrderClearingRepository";

@injectable()
export class SalesOrderClearingRepository implements ISalesOrderClearingRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new sales order clearing record
    async createSalesOrderClearing(): Promise<any> {
        try {
            const query = `
                INSERT INTO sales_order_clearing (sales_order_id, cleared_by, cleared_date, clearing_amount)
                VALUES ($1, $2, $3, $4)
                RETURNING sales_order_clearing_id, sales_order_id, cleared_by, cleared_date, clearing_amount, created_at
            `;
            const values = [];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating sales order clearing: ' + error, 500);
        }
    }

    // Get a list of sales order clearings with pagination
    async getSalesOrderClearings(limit: number, offset: number): Promise<SalesOrderClearing[]> {
        try {
            const query = `
                SELECT sales_order_clearing_id, sales_order_id, cleared_by, cleared_date, clearing_amount, created_at
                FROM sales_order_clearing
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching sales order clearings: ' + error, 500);
        }
    }

    // Get a single sales order clearing by ID
    async getSalesOrderClearing(id: number): Promise<SalesOrderClearing> {
        try {
            const query = `
                SELECT sales_order_clearing_id, sales_order_id, cleared_by, cleared_date, clearing_amount, created_at
                FROM sales_order_clearing
                WHERE sales_order_clearing_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Sales order clearing not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching sales order clearing: ' + error, 500);
        }
    }

    // Update an existing sales order clearing
    async updateSalesOrderClearing(id: number, salesOrderClearing: Partial<SalesOrderClearing>): Promise<SalesOrderClearing> {
        try {
            let query = `UPDATE sales_order_clearing SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(salesOrderClearing).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE sales_order_clearing_id = $${values.length + 1} RETURNING 
                sales_order_clearing_id, sales_order_id, cleared_by, cleared_date, clearing_amount, created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Sales order clearing not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating sales order clearing: ' + error, 500);
        }
    }

    // Delete a sales order clearing by ID
    async deleteSalesOrderClearing(id: number): Promise<SalesOrderClearing> {
        try {
            const query = `
                DELETE FROM sales_order_clearing
                WHERE sales_order_clearing_id = $1
                RETURNING sales_order_clearing_id, sales_order_id, cleared_by, cleared_date, clearing_amount, created_at
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Sales order clearing not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting sales order clearing: ' + error, 500);
        }
    }
}
