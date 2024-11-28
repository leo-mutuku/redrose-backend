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
                INSERT INTO gl_accounts (account_code, account_name, account_type, balance)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
            const values = [
                input.account_code,
                input.account_name,
                input.account_type,
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
                SELECT * FROM gl_accounts WHERE account_code = $1;
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
            const query = `
                UPDATE gl_accounts
                SET account_name = $1, account_type = $2, balance = $3
                WHERE account_code = $4
                RETURNING *;
            `;
            const values = [
                input.account_name,
                input.account_type,
                input.balance,
                accountCode,
            ];
            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError(
                    `GL account with code ${accountCode} not found`,
                    404
                );
            }
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
