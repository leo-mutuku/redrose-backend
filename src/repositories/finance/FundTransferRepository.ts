import { IFundTransferRepository } from "../../interfaces/finance/IFundTransferRepository";

import { AppError } from "../../utils/AppError";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { pgClient } from "../../dbConnection";

@injectable()
export class FundTransferRepository implements IFundTransferRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createFundTransfer(input: any): Promise<any> {
        try {
            const query = `
                INSERT INTO fund_transfers (source_account_id, target_account_id, amount, transfer_date, remarks)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const values = [
                input.source_account_id,
                input.target_account_id,
                input.amount,
                input.transfer_date,
                input.remarks,
            ];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to create fund transfer: " + error, 500);
        }
    }

    async getFundTransferById(id: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM fund_transfers WHERE id = $1;
            `;
            const result = await this.client.query(query, [id]);
            if (result.rows.length === 0) {
                throw new AppError(`Fund transfer with id ${id} not found`, 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to get fund transfer: " + error, 500);
        }
    }

    async updateFundTransfer(id: number, input: any): Promise<any> {
        try {
            const query = `
                UPDATE fund_transfers
                SET source_account_id = $1, target_account_id = $2, amount = $3, transfer_date = $4, remarks = $5
                WHERE id = $6
                RETURNING *;
            `;
            const values = [
                input.source_account_id,
                input.target_account_id,
                input.amount,
                input.transfer_date,
                input.remarks,
                id,
            ];
            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError(`Fund transfer with id ${id} not found`, 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to update fund transfer: " + error, 500);
        }
    }

    async getAllFundTransfers(limit: number, offset: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM fund_transfers
                LIMIT $1 OFFSET $2;
            `;
            const result = await this.client.query(query, [limit, offset]);
            return result.rows;
        } catch (error) {
            throw new AppError("Failed to get fund transfers: " + error, 500);
        }
    }

    async deleteFundTransfer(id: number): Promise<void> {
        try {
            const query = `
                DELETE FROM fund_transfers WHERE id = $1;
            `;
            const result = await this.client.query(query, [id]);
            if (result.rowCount === 0) {
                throw new AppError(`Fund transfer with id ${id} not found`, 404);
            }
        } catch (error) {
            throw new AppError("Failed to delete fund transfer: " + error, 500);
        }
    }
}
