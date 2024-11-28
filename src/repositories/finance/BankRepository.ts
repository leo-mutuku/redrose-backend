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
                INSERT INTO banks (name, branch, swift_code)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [input.name, input.branch, input.swift_code];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to create bank: " + error, 500);
        }
    }

    async getBankById(id: number): Promise<Bank> {
        try {
            const query = `
                SELECT * FROM banks WHERE id = $1;
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
            const query = `
                UPDATE banks
                SET name = $1, branch = $2, swift_code = $3
                WHERE id = $4
                RETURNING *;
            `;
            const values = [input.name, input.branch, input.swift_code, id];
            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError(`Bank with id ${id} not found`, 404);
            }
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
