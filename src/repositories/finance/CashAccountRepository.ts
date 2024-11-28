import { ICashAccountRepository } from "../../interfaces/finance/ICashAccountRepository";

import { AppError } from "../../utils/AppError";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { pgClient } from "../../dbConnection";

@injectable()
export class CashAccountRepository implements ICashAccountRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createCashAccount(input: any): Promise<any> {
        try {
            const query = `
                INSERT INTO cash_accounts (cash_account_name, balance, created_by)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [input.cash_account_name, input.balance, input.created_by];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to create cash account: " + error, 500);
        }
    }

    async getCashAccountById(id: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM cash_accounts WHERE cash_account_id = $1;
            `;
            const result = await this.client.query(query, [id]);
            if (result.rows.length === 0) {
                throw new AppError(`Cash account with id ${id} not found`, 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to get cash account: " + error, 500);
        }
    }

    async updateCashAccount(id: number, input: any): Promise<any> {
        try {
            // Step 1: Fetch the current cash account details
            const currentCashAccountQuery = `
                SELECT * FROM cash_accounts WHERE cash_account_id = $1;
            `;
            const currentCashAccountResult = await this.client.query(currentCashAccountQuery, [id]);

            if (currentCashAccountResult.rows.length === 0) {
                throw new AppError(`Cash account with id ${id} not found`, 404);
            }

            const currentCashAccount = currentCashAccountResult.rows[0];

            // Step 2: Track changes and prepare the update fields
            const updatedFields: string[] = [];
            const values: any[] = [];

            // Check if cash_account_name has changed
            if (input.cash_account_name && input.cash_account_name !== currentCashAccount.cash_account_name) {
                updatedFields.push("cash_account_name = $1");
                values.push(input.cash_account_name);
            }

            // Check if balance has changed
            const parsedBalance = parseFloat(input.balance);
            if (!isNaN(parsedBalance) && parsedBalance !== currentCashAccount.balance) {
                updatedFields.push("balance = $2");
                values.push(parsedBalance);
            }

            // Check if created_by has changed
            if (input.created_by && input.created_by !== currentCashAccount.created_by) {
                updatedFields.push("created_by = $3");
                values.push(input.created_by);
            }

            // If no fields have changed, throw an error
            if (updatedFields.length === 0) {
                throw new AppError("No changes detected to update cash account.", 400);
            }

            // Step 3: Build the dynamic query for the update
            const query = `
                UPDATE cash_accounts
                SET ${updatedFields.join(", ")}
                WHERE cash_account_id = $${values.length + 1}
                RETURNING *;
            `;

            // Step 4: Add the id to the values array
            values.push(id);

            // Execute the query
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to update cash account: " + error, 500);
        }
    }



    async getAllCashAccounts(limit: number, offset: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM cash_accounts
                LIMIT $1 OFFSET $2;
            `;
            const result = await this.client.query(query, [limit, offset]);
            return result.rows;
        } catch (error) {
            throw new AppError("Failed to get cash accounts: " + error, 500);
        }
    }

    async deleteCashAccount(id: number): Promise<void> {
        try {
            const query = `
                DELETE FROM cash_accounts WHERE id = $1;
            `;
            const result = await this.client.query(query, [id]);
            if (result.rowCount === 0) {
                throw new AppError(`Cash account with id ${id} not found`, 404);
            }
        } catch (error) {
            throw new AppError("Failed to delete cash account: " + error, 500);
        }
    }
}
