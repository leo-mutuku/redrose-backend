
import { IAccountRepository } from "../../interfaces/finance/IAccountRepository";
import { INTERFACE_TYPE } from "../../utils";
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



    delete(accountId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async create(input: any): Promise<any> {
        try {
            const query = `
                INSERT INTO accounts (name, email, balance)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [input.name, input.email, input.balance];
            const result = await this.db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to create account: " + error.message, 500);
        }
    }

    async findById(id: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM accounts WHERE id = $1;
            `;
            const result = await this.db.query(query, [id]);
            if (result.rows.length === 0) {
                throw new AppError(`Account with id ${id} not found`, 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to get account: " + error.message, 500);
        }
    }

    async update(id: number, input: any): Promise<any> {
        try {
            const query = `
                UPDATE accounts
                SET name = $1, email = $2, balance = $3
                WHERE id = $4
                RETURNING *;
            `;
            const values = [input.name, input.email, input.balance, id];
            const result = await this.db.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError(`Account with id ${id} not found`, 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to update account: " + error.message, 500);
        }
    }

    async findAll(limit: number, offset: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM accounts
                LIMIT $1 OFFSET $2;
            `;
            const result = await this.db.query(query, [limit, offset]);
            return result.rows;
        } catch (error) {
            throw new AppError("Failed to get accounts: " + error.message, 500);
        }
    }

    async deleteAccount(id: number): Promise<void> {
        try {
            const query = `
                DELETE FROM accounts WHERE id = $1;
            `;
            const result = await this.db.query(query, [id]);
            if (result.rowCount === 0) {
                throw new AppError(`Account with id ${id} not found`, 404);
            }
        } catch (error) {
            throw new AppError("Failed to delete account: " + error.message, 500);
        }
    }
}
