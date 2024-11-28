import { IBankRepository } from "../../interfaces/finance/IBankRepository";
import { Bank } from "../../entities/finance/Banks";
import { AppError } from "../../utils/AppError";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { pgClient } from "../../dbConnection";

@injectable()
export class BankRepository implements IBankRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createBank(input: any): Promise<Bank> {
        try {
            const query = `
                INSERT INTO banks (bank_name, balance, created_by)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [input.bank_name, input.balance, input.created_by];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to create bank: " + error, 500);
        }
    }

    async getBankById(id: number): Promise<Bank> {
        try {
            const query = `
                SELECT * FROM banks WHERE bank_id = $1;
            `;
            const result = await this.client.query(query, [id]);
            if (result.rows.length === 0) {
                throw new AppError(`Bank with id ${id} not found`, 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to get bank: " + error, 500);
        }
    }
    async updateBank(id: number, input: any): Promise<Bank> {
        try {
            // Step 1: Fetch the current bank details
            const currentBankQuery = `
                SELECT * FROM banks WHERE bank_id = $1;
            `;
            const currentBankResult = await this.client.query(currentBankQuery, [id]);

            if (currentBankResult.rows.length === 0) {
                throw new AppError(`Bank with id ${id} not found`, 404);
            }

            const currentBank = currentBankResult.rows[0];

            // Step 2: Track changes and prepare the update fields
            const updatedFields: string[] = [];
            const values: any[] = [];

            // Dynamically add placeholders
            if (input.bank_name && input.bank_name !== currentBank.bank_name) {
                updatedFields.push(`bank_name = $${values.length + 1}`);
                values.push(input.bank_name);
            }

            if (input.balance !== undefined && parseFloat(input.balance) !== currentBank.balance) {
                updatedFields.push(`balance = $${values.length + 1}`);
                values.push(input.balance);
            }

            if (input.created_by && input.created_by !== currentBank.created_by) {
                updatedFields.push(`created_by = $${values.length + 1}`);
                values.push(input.created_by);
            }

            if (updatedFields.length === 0) {
                throw new AppError("No changes detected to update bank.", 400);
            }

            // Step 3: Build the dynamic query for the update
            const query = `
                UPDATE banks
                SET ${updatedFields.join(", ")}
                WHERE bank_id = $${values.length + 1}
                RETURNING *;
            `;

            // Step 4: Add the id to the values array
            values.push(id);

            // Execute the query
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to update bank: " + error, 500);
        }
    }



    async getAllBanks(limit: number, offset: number): Promise<Bank[]> {
        try {
            const query = `
                SELECT * FROM banks
                LIMIT $1 OFFSET $2;
            `;
            const result = await this.client.query(query, [limit, offset]);
            return result.rows;
        } catch (error) {
            throw new AppError("Failed to get banks: " + error, 500);
        }
    }

    async deleteBank(id: number): Promise<void> {
        try {
            const query = `
                DELETE FROM banks WHERE id = $1;
            `;
            const result = await this.client.query(query, [id]);
            if (result.rowCount === 0) {
                throw new AppError(`Bank with id ${id} not found`, 404);
            }
        } catch (error) {
            throw new AppError("Failed to delete bank: " + error, 500);
        }
    }
}
