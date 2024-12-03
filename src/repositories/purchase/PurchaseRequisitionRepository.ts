import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { PurchaseRequisition } from "../../entities/purchaseRequisition/PurchaseRequisition";
import { IPurchaseRequisitionRepository } from "../../interfaces/purchaseRequisition/IPurchaseRequisitionRepository";

@injectable()
export class PurchaseRequisitionRepository implements IPurchaseRequisitionRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new purchase requisition
    async createPurchaseRequisition({
        requisition_number,
        requested_by,
        request_date,
        total_amount,
        status,
        created_by
    }: PurchaseRequisition): Promise<PurchaseRequisition> {
        try {
            const query = `
                INSERT INTO purchase_requisition (requisition_number, requested_by, request_date, total_amount, status, created_by)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING purchase_requisition_id, requisition_number, requested_by, request_date, total_amount, status, created_by, created_at
            `;
            const values = [requisition_number, requested_by, request_date, total_amount, status, created_by];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating purchase requisition: ' + error, 500);
        }
    }

    // Get a list of purchase requisitions with pagination
    async getPurchaseRequisitions(limit: number, offset: number): Promise<PurchaseRequisition[]> {
        try {
            const query = `
                SELECT purchase_requisition_id, requisition_number, requested_by, request_date, total_amount, status, created_by, created_at
                FROM purchase_requisition
                LIMIT $1 OFFSET $2
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
