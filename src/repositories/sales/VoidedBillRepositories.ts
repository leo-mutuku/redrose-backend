import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { VoidedBill } from "../../entities/voidedBill/VoidedBill";
import { IVoidedBillRepository } from "../../interfaces/voidedBill/IVoidedBillRepository";

@injectable()
export class VoidedBillRepository implements IVoidedBillRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new voided bill
    async createVoidedBill({
        bill_id,
        voided_by,
        voided_date,
        voided_reason
    }: VoidedBill): Promise<VoidedBill> {
        try {
            const query = `
                INSERT INTO voided_bills (bill_id, voided_by, voided_date, voided_reason)
                VALUES ($1, $2, $3, $4)
                RETURNING voided_bill_id, bill_id, voided_by, voided_date, voided_reason, created_at
            `;
            const values = [bill_id, voided_by, voided_date, voided_reason];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating voided bill: ' + error, 500);
        }
    }

    // Get a list of voided bills with pagination
    async getVoidedBills(limit: number, offset: number): Promise<VoidedBill[]> {
        try {
            const query = `
                SELECT voided_bill_id, bill_id, voided_by, voided_date, voided_reason, created_at
                FROM voided_bills
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching voided bills: ' + error, 500);
        }
    }

    // Get a single voided bill by ID
    async getVoidedBill(id: number): Promise<VoidedBill> {
        try {
            const query = `
                SELECT voided_bill_id, bill_id, voided_by, voided_date, voided_reason, created_at
                FROM voided_bills
                WHERE voided_bill_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Voided bill not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching voided bill: ' + error, 500);
        }
    }

    // Update an existing voided bill
    async updateVoidedBill(id: number, voidedBill: Partial<VoidedBill>): Promise<VoidedBill> {
        try {
            let query = `UPDATE voided_bills SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(voidedBill).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE voided_bill_id = $${values.length + 1} RETURNING 
                voided_bill_id, bill_id, voided_by, voided_date, voided_reason, created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Voided bill not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating voided bill: ' + error, 500);
        }
    }

    // Delete a voided bill by ID
    async deleteVoidedBill(id: number): Promise<VoidedBill> {
        try {
            const query = `
                DELETE FROM voided_bills
                WHERE voided_bill_id = $1
                RETURNING voided_bill_id, bill_id, voided_by, voided_date, voided_reason, created_at
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Voided bill not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting voided bill: ' + error, 500);
        }
    }
}
