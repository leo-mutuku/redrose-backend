import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IDeductionRepository } from "../../interfaces/payroll/IDeductionRepository";
import { Deduction } from "../../entities/payroll/Deduction";

@injectable()
export class DeductionRepository implements IDeductionRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new deduction
    async createDeduction({

    }: Deduction): Promise<Deduction> {
        try {
            const query = `
                INSERT INTO deduction (deduction_type, amount, description, deduction_date)
                VALUES ($1, $2, $3, $4)
                RETURNING deduction_id, deduction_type, amount, description,
                TO_CHAR(deduction_date, 'DD/MM/YYYY') AS deduction_date
            `;
            const values = [];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating deduction: ' + error, 500);
        }
    }

    // Get a list of deductions with pagination
    async getDeductions(limit: number, offset: number): Promise<Deduction[]> {
        try {
            const query = `
                SELECT deduction_id, deduction_type, amount, description,
                TO_CHAR(deduction_date, 'DD/MM/YYYY') AS deduction_date
                FROM deduction
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching deductions: ' + error, 500);
        }
    }

    // Get a single deduction by ID
    async getDeduction(id: number): Promise<Deduction> {
        try {
            const query = `
                SELECT deduction_id, deduction_type, amount, description,
                TO_CHAR(deduction_date, 'DD/MM/YYYY') AS deduction_date
                FROM deduction
                WHERE deduction_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Deduction not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching deduction: ' + error, 500);
        }
    }

    // Update an existing deduction
    async updateDeduction(id: number, deduction: Partial<Deduction>): Promise<Deduction> {
        try {
            let query = `UPDATE deduction SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(deduction).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE deduction_id = $${values.length + 1} RETURNING 
                deduction_id, deduction_type, amount, description,
                TO_CHAR(deduction_date, 'DD/MM/YYYY') AS deduction_date`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Deduction not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating deduction: ' + error, 500);
        }
    }

    // Delete a deduction by ID
    async deleteDeduction(id: number): Promise<Deduction> {
        try {
            const query = `
                DELETE FROM deduction
                WHERE deduction_id = $1
                RETURNING deduction_id, deduction_type, amount, description,
                TO_CHAR(deduction_date, 'DD/MM/YYYY') AS deduction_date
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Deduction not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting deduction: ' + error, 500);
        }
    }
}
