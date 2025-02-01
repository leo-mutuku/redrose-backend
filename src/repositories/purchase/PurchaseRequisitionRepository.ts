import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";

import { IPurchaseRequisitionRepository } from "../../interfaces/purchase/IPurchaseRequisitionRepository";
import { PurchaseRequisition } from "../../entities/purchase/PurchaseRequisition";

@injectable()
export class PurchaseRequisitionRepository implements IPurchaseRequisitionRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new purchase requisition
    async createPurchaseRequisition({
        purchase_date, total, account_type, order_details, bank_id, cash_account_id, staff_id, shift_id }: PurchaseRequisition): Promise<PurchaseRequisition> {
        try {
            const query = `
                INSERT INTO purchase_requisition (purchase_date, total, account_type, created_by, shift_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const values = [purchase_date, total, account_type, staff_id, shift_id];
            const result = await this.client.query(query, values);
            // insert into purchase_requisition_details
            const purchase_requisition_id = result.rows[0].purchase_requisition_id
            for (let item of order_details) {
                console.log(item)
                const query = `
                    INSERT INTO purchase_requisition_details (purchase_requisition_id, store_item_id, quantity, buying_price, total_price, vat_type, created_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `;
                const values = [purchase_requisition_id, item.store_item_id, item.quantity, item.buying_price, item.total_price, item.vat_type, staff_id];
                await this.client.query(query, values);
            }

            if (account_type == "BANK") {
                //bank account
                const query2 = `update banks set balance = balance - $1 where bank_id = $2 returning *`;
                const values2 = [total, bank_id];
                console.log(values2)
                const res3 = await this.client.query(query2, values2);
                // bank_entries
                const query3 = `insert into bank_entries (bank_id, description, debit, credit, balance) values ($1, $2, $3, $4, $5) returning *`;
                const values3 = [bank_id, 'Purchase Requisition -DR', total, 0, Number(res3.rows[0].balance)];
                await this.client.query(query3, values3);

            }
            if (account_type == "CASH") {
                //cash account
                const query2 = `update cash_accounts set balance = balance - $1 where cash_account_id = $2 returning *`;
                const values2 = [total, cash_account_id];
                const res3 = await this.client.query(query2, values2);
                // cash_entries
                const query3 = `insert into cash_account_entries (cash_account_id, description, debit, credit, balance) values ($1, $2, $3, $4, $5) returning *`;
                const values3 = [cash_account_id, 'Purchase Requisition -DR', total, 0, Number(res3.rows[0].balance)];
                await this.client.query(query3, values3);
            }

            // cash acccount
            // cash_entries
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating purchase requisition: ' + error, 500);
        }
    }

    // Get a list of purchase requisitions with pagination
    async getPurchaseRequisitions(limit: number, offset: number): Promise<PurchaseRequisition[]> {
        try {
            const query = `
                SELECT 
    po.purchase_requisition_id,
    po.purchase_date,
    po.total,
    json_agg(
        json_build_object(
            'store_item_id', pod.store_item_id,
            'item_name', ir.item_name,  -- Include item_name from item_register
            'quantity', pod.quantity,
            'buying_price', pod.buying_price
        )
    ) AS purchase_order_details
FROM 
    purchase_requisition po

-- Join with 'purchase_order_details' table
LEFT JOIN purchase_requisition_details pod ON po.purchase_requisition_id = pod.purchase_requisition_id
-- Join with 'store_item' table to get item details
LEFT JOIN store_item si ON pod.store_item_id = si.store_item_id
-- Join with 'item_register' table to get item_name
LEFT JOIN item_register ir ON si.item_id = ir.item_id
GROUP BY 
    po.purchase_requisition_id, po.purchase_date
ORDER BY 
    po.created_at DESC
LIMIT $1 OFFSET $2;  -- Set your desired limit and offset
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);
            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching purchase requisitions: ' + error, 500);
        }
    }

    // Get a single purchase requisition by ID
    async getPurchaseRequisition(id: number): Promise<PurchaseRequisition> {
        try {
            const query = `
                SELECT purchase_requisition_id, requisition_number, requested_by, request_date, total_amount, status, created_by, created_at
                FROM purchase_requisition
                WHERE purchase_requisition_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Purchase requisition not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching purchase requisition: ' + error, 500);
        }
    }

    // Update an existing purchase requisition
    async updatePurchaseRequisition(id: number, purchaseRequisition: Partial<PurchaseRequisition>): Promise<PurchaseRequisition> {
        try {
            let query = `UPDATE purchase_requisition SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(purchaseRequisition).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE purchase_requisition_id = $${values.length + 1} RETURNING 
                purchase_requisition_id, requisition_number, requested_by, request_date, total_amount, status, created_by, created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Purchase requisition not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating purchase requisition: ' + error, 500);
        }
    }

    // Delete a purchase requisition by ID
    async deletePurchaseRequisition(id: number): Promise<PurchaseRequisition> {
        try {
            const query = `
                DELETE FROM purchase_requisition
                WHERE purchase_requisition_id = $1
                RETURNING purchase_requisition_id, requisition_number, requested_by, request_date, total_amount, status, created_by, created_at
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Purchase requisition not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting purchase requisition: ' + error, 500);
        }
    }
}
