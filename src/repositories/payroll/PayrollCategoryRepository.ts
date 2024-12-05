import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { PayrollCategory } from "../../entities/payroll/PayrollCategory";
import { IPayrollCategoryRepository } from "../../interfaces/payroll/IPayrollCategoryRepository";

@injectable()
export class PayrollCategoryRepository implements IPayrollCategoryRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new payroll category
    async createPayrollCategory({

    }: PayrollCategory): Promise<PayrollCategory> {
        try {
            const query = `
                INSERT INTO payroll_category (category_name, category_description, is_active)
                VALUES ($1, $2, $3)
                RETURNING payroll_category_id, category_name, category_description, is_active
            `;
            const values = [];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating payroll category: ' + error, 500);
        }
    }

    // Get a list of payroll categories with pagination
    async getPayrollCategories(limit: number, offset: number): Promise<PayrollCategory[]> {
        try {
            const query = `
                SELECT payroll_category_id, category_name, category_description, is_active
                FROM payroll_category
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching payroll categories: ' + error, 500);
        }
    }

    // Get a single payroll category by ID
    async getPayrollCategory(id: number): Promise<PayrollCategory> {
        try {
            const query = `
                SELECT payroll_category_id, category_name, category_description, is_active
                FROM payroll_category
                WHERE payroll_category_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Payroll category not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching payroll category: ' + error, 500);
        }
    }

    // Update an existing payroll category
    async updatePayrollCategory(id: number, payrollCategory: Partial<PayrollCategory>): Promise<PayrollCategory> {
        try {
            let query = `UPDATE payroll_category SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(payrollCategory).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE payroll_category_id = $${values.length + 1} RETURNING 
                payroll_category_id, category_name, category_description, is_active`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Payroll category not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating payroll category: ' + error, 500);
        }
    }

    // Delete a payroll category by ID
    async deletePayrollCategory(id: number): Promise<PayrollCategory> {
        try {
            const query = `
                DELETE FROM payroll_category
                WHERE payroll_category_id = $1
                RETURNING payroll_category_id, category_name, category_description, is_active
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Payroll category not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting payroll category: ' + error, 500);
        }
    }
}
