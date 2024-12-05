import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";

import { IPayrollSetupRepository } from "../../interfaces/payroll/IPayrollSetupRepository";
import { PayrollSetup } from "../../entities/payroll/PayrollSetup";

@injectable()
export class PayrollSetupRepository implements IPayrollSetupRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new payroll setup record
    async createPayrollSetup({

    }: PayrollSetup): Promise<PayrollSetup> {
        try {
            const query = `
                INSERT INTO payroll_setup (setup_name, setup_description, is_active, created_by)
                VALUES ($1, $2, $3, $4)
                RETURNING payroll_setup_id, setup_name, setup_description, is_active, created_by, created_at
            `;
            const values = [];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating payroll setup: ' + error, 500);
        }
    }

    // Get a list of payroll setup records with pagination
    async getPayrollSetups(limit: number, offset: number): Promise<PayrollSetup[]> {
        try {
            const query = `
                SELECT payroll_setup_id, setup_name, setup_description, is_active, created_by, created_at
                FROM payroll_setup
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching payroll setups: ' + error, 500);
        }
    }

    // Get a single payroll setup record by ID
    async getPayrollSetup(id: number): Promise<PayrollSetup> {
        try {
            const query = `
                SELECT payroll_setup_id, setup_name, setup_description, is_active, created_by, created_at
                FROM payroll_setup
                WHERE payroll_setup_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Payroll setup not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching payroll setup: ' + error, 500);
        }
    }

    // Update an existing payroll setup record
    async updatePayrollSetup(id: number, payrollSetup: Partial<PayrollSetup>): Promise<PayrollSetup> {
        try {
            let query = `UPDATE payroll_setup SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(payrollSetup).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE payroll_setup_id = $${values.length + 1} RETURNING 
                payroll_setup_id, setup_name, setup_description, is_active, created_by, created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Payroll setup not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating payroll setup: ' + error, 500);
        }
    }

    // Delete a payroll setup record by ID
    async deletePayrollSetup(id: number): Promise<PayrollSetup> {
        try {
            const query = `
                DELETE FROM payroll_setup
                WHERE payroll_setup_id = $1
                RETURNING payroll_setup_id, setup_name, setup_description, is_active, created_by, created_at
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Payroll setup not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting payroll setup: ' + error, 500);
        }
    }
}
