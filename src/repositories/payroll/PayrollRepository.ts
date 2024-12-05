import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";

import { IPayrollRepository } from "../../interfaces/payroll/IPayrollRepository";
import { Payroll } from "../../entities/payroll/Payroll";

@injectable()
export class PayrollRepository implements IPayrollRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new payroll record
    async createPayroll({

    }: Payroll): Promise<Payroll> {
        try {
            const query = `
                INSERT INTO payroll (employee_id, payroll_date, gross_salary, deductions, net_salary, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING payroll_id, employee_id, payroll_date, gross_salary, deductions, net_salary, status
            `;
            const values = [];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating payroll record: ' + error, 500);
        }
    }

    // Get a list of payroll records with pagination
    async getPayrolls(limit: number, offset: number): Promise<Payroll[]> {
        try {
            const query = `
                SELECT payroll_id, employee_id, payroll_date, gross_salary, deductions, net_salary, status
                FROM payroll
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching payroll records: ' + error, 500);
        }
    }

    // Get a single payroll record by ID
    async getPayroll(id: number): Promise<Payroll> {
        try {
            const query = `
                SELECT payroll_id, employee_id, payroll_date, gross_salary, deductions, net_salary, status
                FROM payroll
                WHERE payroll_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Payroll record not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching payroll record: ' + error, 500);
        }
    }

    // Update an existing payroll record
    async updatePayroll(id: number, payroll: Partial<Payroll>): Promise<Payroll> {
        try {
            let query = `UPDATE payroll SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(payroll).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE payroll_id = $${values.length + 1} RETURNING 
                payroll_id, employee_id, payroll_date, gross_salary, deductions, net_salary, status`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Payroll record not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating payroll record: ' + error, 500);
        }
    }

    // Delete a payroll record by ID
    async deletePayroll(id: number): Promise<Payroll> {
        try {
            const query = `
                DELETE FROM payroll
                WHERE payroll_id = $1
                RETURNING payroll_id, employee_id, payroll_date, gross_salary, deductions, net_salary, status
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Payroll record not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting payroll record: ' + error, 500);
        }
    }
}
