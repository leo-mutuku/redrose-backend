import { IGLAccountRepository } from "../../interfaces/finance/IGLAccountRepository";

import { AppError } from "../../utils/AppError";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { pgClient } from "../../dbConnection";

@injectable()
export class GLAccountRepository implements IGLAccountRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }


    async createGLAccount(input: any): Promise<any> {
        try {
            const query = `
                INSERT INTO gl_accounts (gl_account_name,  balance, created_by)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [
                input.gl_account_name,
                input.balance,
                input.balance,
            ];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to create GL account: " + error, 500);
        }
    }

    async getGLAccountById(accountCode: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM gl_accounts WHERE gl_account_id = $1;
            `;
            const result = await this.client.query(query, [accountCode]);
            if (result.rows.length === 0) {
                throw new AppError(
                    `GL account with code ${accountCode} not found`,
                    404
                );
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to get GL account: " + error, 500);
        }
    }

    async updateGLAccount(accountCode: number, input: any): Promise<any> {
        try {
            // First, fetch the current GL account details
            const currentAccountQuery = `
                SELECT * FROM gl_accounts WHERE gl_account_id = $1;
            `;
            const currentAccountResult = await this.client.query(currentAccountQuery, [accountCode]);

            if (currentAccountResult.rows.length === 0) {
                throw new AppError(`GL account with code ${accountCode} not found`, 404);
            }

            const currentAccount = currentAccountResult.rows[0];

            // Track which fields have changed
            const updatedFields: string[] = [];
            const values: any[] = [];

            // Dynamically track placeholder indices
            if (input.gl_account_name && input.gl_account_name !== currentAccount.gl_account_name) {
                updatedFields.push(`gl_account_name = $${values.length + 1}`);
                values.push(input.gl_account_name);
            }

            if (input.balance !== undefined && input.balance !== currentAccount.balance) {
                updatedFields.push(`balance = $${values.length + 1}`);
                values.push(input.balance);
            }

            // If no fields have changed, throw an error
            if (updatedFields.length === 0) {
                throw new AppError("No changes detected to update GL account.", 400);
            }

            // Proceed with updating the GL account
            const query = `
                UPDATE gl_accounts
                SET ${updatedFields.join(", ")}
                WHERE gl_account_id = $${values.length + 1}
                RETURNING *;
            `;

            // Add the accountCode to the values array
            values.push(accountCode);

            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to update GL account: " + error, 500);
        }
    }



    async getAllGLAccounts(limit: number, offset: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM gl_accounts
                LIMIT $1 OFFSET $2;
            `;
            const result = await this.client.query(query, [limit, offset]);
            return result.rows;
        } catch (error) {
            throw new AppError("Failed to get GL accounts: " + error, 500);
        }
    }

    async deleteGLAccount(accountCode: number): Promise<void> {
        try {
            const query = `
                DELETE FROM gl_accounts WHERE account_code = $1;
            `;
            const result = await this.client.query(query, [accountCode]);
            if (result.rowCount === 0) {
                throw new AppError(
                    `GL account with code ${accountCode} not found`,
                    404
                );
            }
        } catch (error) {
            throw new AppError("Failed to delete GL account: " + error, 500);
        }
    }
}
