
import { IAccountRepository } from "../../interfaces/finance/IAccountRepository";
import { Account } from "../../entities/finance/Accounts";
import { AppError } from "../../utils/AppError";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { pgClient } from "../../dbConnection";

@injectable()
export class AccountRepository implements IAccountRepository {
    private client: Pool
    constructor() {
        this.client = pgClient()
    }

    async createAccount(input: any): Promise<Account> {
        try {
            const query = `
                INSERT INTO accounts (account_name,gl_account_id , balance, created_by)
                VALUES ($1, $2, $3 ,$4)
                RETURNING *;
            `;
            const values = [input.account_name, input.gl_account_id, parseFloat(input.balance), parseInt(input.created_by)];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to create account: " + error, 500);
        }
    }

    async getAccountById(id: number): Promise<Account> {
        try {
            const query = `
                SELECT * FROM accounts WHERE account_id = $1;
            `;
            const result = await this.client.query(query, [id]);
            if (result.rows.length === 0) {
                throw new AppError(`Account with id ${id} not found`, 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to get account: " + error, 500);
        }
    }

    async updateAccount(id: number, input: any): Promise<any> {
        try {

            // First, fetch the current account details
            const currentAccountQuery = `
                SELECT * FROM accounts WHERE account_id = $1;
            `;
            const currentAccountResult = await this.client.query(currentAccountQuery, [id]);

            if (currentAccountResult.rows.length === 0) {
                throw new AppError(`Account with id ${id} not found`, 404);
            }

            const currentAccount = currentAccountResult.rows[0];

            // Check if any fields have changed
            const updatedFields: any[] = [];
            const values: any[] = [];

            // Check if name has changed
            if (input.account_name && input.account_name !== currentAccount.name) {
                updatedFields.push("account_name = $1");
                values.push(input.account_name);
            }

            // Check if balance has changed

            if (input.balance !== undefined && parseFloat(input.balance) !== currentAccount.balance) {
                updatedFields.push("balance = $2");
                values.push(input.balance);
            }

            if (updatedFields.length === 0) {
                // No fields have changed, throw an AppError
                throw new AppError("No changes detected to update.", 400);
            }

            // Update the account with the changed fields
            const query = `
                UPDATE accounts
                SET ${updatedFields.join(", ")}
                WHERE account_id = $${values.length + 1}
                RETURNING *;
            `;

            // Add the account ID to the end of the values array
            values.push(id);

            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to update account: " + error, 500);
        }
    }



    async getAllAccounts(limit: number, offset: number): Promise<Account[]> {
        try {
            const query = `
                SELECT * FROM accounts
                LIMIT $1 OFFSET $2;
            `;
            const result = await this.client.query(query, [limit, offset]);
            return result.rows;
        } catch (error) {
            throw new AppError("Failed to get accounts: " + error, 500);
        }
    }

    async deleteAccount(id: number): Promise<void> {
        try {
            const query = `
                DELETE FROM accounts WHERE id = $1;
            `;
            const result = await this.client.query(query, [id]);
            if (result.rowCount === 0) {
                throw new AppError(`Account with id ${id} not found`, 404);
            }
        } catch (error) {
            throw new AppError("Failed to delete account: " + error, 500);
        }
    }


}
