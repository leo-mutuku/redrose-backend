import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { ICashierRegisterRepository } from "../../interfaces/sales/IcashierRegisterRepository";
import { CashierRegister } from "../../entities/sales/CashierRegister";

@injectable()
export class CashierRegisterRepository implements ICashierRegisterRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }
    openCashierRegister(input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    // Create a new cashier register record
    async createCashierRegister({

    }: CashierRegister): Promise<CashierRegister> {
        try {
            const query = `
                INSERT INTO cashier_register (register_number, cashier_id, opening_balance, status, created_by)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING cashier_register_id, register_number, cashier_id, opening_balance, status, created_by, created_at
            `;
            const values = [];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating cashier register: ' + error, 500);
        }
    }

    // Get a list of cashier registers with pagination
    async getCashierRegisters(limit: number, offset: number): Promise<CashierRegister[]> {
        try {
            const query = `
                SELECT cashier_register_id, register_number, cashier_id, opening_balance, status, created_by, created_at
                FROM cashier_register
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching cashier registers: ' + error, 500);
        }
    }

    // Get a single cashier register by ID
    async getCashierRegister(id: number): Promise<CashierRegister> {
        try {
            const query = `
                SELECT cashier_register_id, register_number, cashier_id, opening_balance, status, created_by, created_at
                FROM cashier_register
                WHERE cashier_register_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Cashier register not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching cashier register: ' + error, 500);
        }
    }

    // Update an existing cashier register
    async updateCashierRegister(id: number, cashierRegister: Partial<CashierRegister>): Promise<CashierRegister> {
        try {
            let query = `UPDATE cashier_register SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(cashierRegister).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE cashier_register_id = $${values.length + 1} RETURNING 
                cashier_register_id, register_number, cashier_id, opening_balance, status, created_by, created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Cashier register not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating cashier register: ' + error, 500);
        }
    }

    // Delete a cashier register by ID
    async deleteCashierRegister(id: number): Promise<CashierRegister> {
        try {
            const query = `
                DELETE FROM cashier_register
                WHERE cashier_register_id = $1
                RETURNING cashier_register_id, register_number, cashier_id, opening_balance, status, created_by, created_at
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Cashier register not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting cashier register: ' + error, 500);
        }
    }
}
