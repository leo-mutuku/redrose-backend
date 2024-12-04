import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";

import { IPurchaseOrderRepository } from "../../interfaces/purchase/IpurchaseOrderRepository";
import { PurchaseOrder } from "../../entities/purchase/PurchaseOrder";

@injectable()
export class PurchaseOrderRepository implements IPurchaseOrderRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new purchase order record
    async createPurchaseOrder({

    }: PurchaseOrder): Promise<PurchaseOrder> {
        try {
            const query = `
                INSERT INTO purchase_order (order_number, supplier_id, order_date, total_amount, status, created_by)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING purchase_order_id, order_number, supplier_id, order_date, total_amount, status, created_by, created_at
            `;
            const values = [];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating purchase order: ' + error, 500);
        }
    }

    // Get a list of purchase orders with pagination
    async getPurchaseOrders(limit: number, offset: number): Promise<PurchaseOrder[]> {
        try {
            const query = `
                SELECT purchase_order_id, order_number, supplier_id, order_date, total_amount, status, created_by, created_at
                FROM purchase_order
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching purchase orders: ' + error, 500);
        }
    }

    // Get a single purchase order by ID
    async getPurchaseOrder(id: number): Promise<PurchaseOrder> {
        try {
            const query = `
                SELECT purchase_order_id, order_number, supplier_id, order_date, total_amount, status, created_by, created_at
                FROM purchase_order
                WHERE purchase_order_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Purchase order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching purchase order: ' + error, 500);
        }
    }

    // Update an existing purchase order
    async updatePurchaseOrder(id: number, purchaseOrder: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
        try {
            let query = `UPDATE purchase_order SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(purchaseOrder).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE purchase_order_id = $${values.length + 1} RETURNING 
                purchase_order_id, order_number, supplier_id, order_date, total_amount, status, created_by, created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Purchase order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating purchase order: ' + error, 500);
        }
    }

    // Delete a purchase order by ID
    async deletePurchaseOrder(id: number): Promise<PurchaseOrder> {
        try {
            const query = `
                DELETE FROM purchase_order
                WHERE purchase_order_id = $1
                RETURNING purchase_order_id, order_number, supplier_id, order_date, total_amount, status, created_by, created_at
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Purchase order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting purchase order: ' + error, 500);
        }
    }
}
