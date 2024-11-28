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
                INSERT INTO cash_accounts (name, balance, currency)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [input.name, input.balance, input.currency];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to create cash account: " + error, 500);
        }
    }

    async getCashAccountById(id: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM cash_accounts WHERE id = $1;
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
            const query = `
                UPDATE cash_accounts
                SET name = $1, balance = $2, currency = $3
                WHERE id = $4
                RETURNING *;
            `;
            const values = [input.name, input.balance, input.currency, id];
            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError(`Cash account with id ${id} not found`, 404);
            }
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
