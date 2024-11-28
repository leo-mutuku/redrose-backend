import { IMpesaTillRepository } from "../../interfaces/finance/IMpesaTillRepository";

import { AppError } from "../../utils/AppError";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { pgClient } from "../../dbConnection";

@injectable()
export class MpesaTillRepository implements IMpesaTillRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }



    async createMpesaTill(input: any): Promise<any> {
        try {
            const query = `
                INSERT INTO mpesa_tills (till_number, business_name, balance, created_at)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
            const values = [
                input.till_number,
                input.business_name,
                input.balance,
                input.created_at || new Date(),
            ];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to create Mpesa till: " + error, 500);
        }
    }

    async getMpesaTillById(tillNumber: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM mpesa_tills WHERE till_number = $1;
            `;
            const result = await this.client.query(query, [tillNumber]);
            if (result.rows.length === 0) {
                throw new AppError(`Mpesa till with number ${tillNumber} not found`, 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to get Mpesa till: " + error, 500);
        }
    }

    async updateMpesaTill(tillNumber: number, input: any): Promise<any> {
        try {
            const query = `
                UPDATE mpesa_tills
                SET business_name = $1, balance = $2, updated_at = $3
                WHERE till_number = $4
                RETURNING *;
            `;
            const values = [
                input.business_name,
                input.balance,
                new Date(),
                tillNumber,
            ];
            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError(`Mpesa till with number ${tillNumber} not found`, 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to update Mpesa till: " + error, 500);
        }
    }

    async getAllMpesaTill(limit: number, offset: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM mpesa_tills
                LIMIT $1 OFFSET $2;
            `;
            const result = await this.client.query(query, [limit, offset]);
            return result.rows;
        } catch (error) {
            throw new AppError("Failed to get Mpesa tills: " + error, 500);
        }
    }

    async deleteMpesaTill(tillNumber: number): Promise<void> {
        try {
            const query = `
                DELETE FROM mpesa_tills WHERE till_number = $1;
            `;
            const result = await this.client.query(query, [tillNumber]);
            if (result.rowCount === 0) {
                throw new AppError(`Mpesa till with number ${tillNumber} not found`, 404);
            }
        } catch (error) {
            throw new AppError("Failed to delete Mpesa till: " + error, 500);
        }
    }
}
