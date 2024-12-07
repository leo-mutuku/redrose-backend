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
                INSERT INTO mpesa_till (till_number, mpesa_till_name, balance)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [
                input.till_number,
                input.mpesa_till_name,
                input.balance,

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
                SELECT * FROM mpesa_till WHERE mpesa_till_id = $1;
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
            // First, fetch the current Mpesa till details
            const currentTillQuery = `
                SELECT * FROM mpesa_till WHERE mpesa_till_id = $1;
            `;
            const currentTillResult = await this.client.query(currentTillQuery, [tillNumber]);

            if (currentTillResult.rows.length === 0) {
                throw new AppError(`Mpesa till with number ${tillNumber} not found`, 404);
            }

            const currentTill = currentTillResult.rows[0];

            // Track which fields have changed
            const updatedFields: string[] = [];
            const values: any[] = [];

            // Dynamically track placeholder indices
            if (input.mpesa_till_name && input.mpesa_till_name !== currentTill.mpesa_till_name) {
                updatedFields.push(`mpesa_till_name = $${values.length + 1}`);
                values.push(input.mpesa_till_name);
            }

            if (input.balance !== undefined && input.balance !== currentTill.balance) {
                updatedFields.push(`balance = $${values.length + 1}`);
                values.push(input.balance);
            }

            if (input.till_number !== undefined && input.till_number !== currentTill.till_number) {
                updatedFields.push(`till_number = $${values.length + 1}`);
                values.push(input.till_number);
            }

            // If no fields have changed, throw an error
            if (updatedFields.length === 0) {
                throw new AppError("No changes detected to update Mpesa till.", 400);
            }

            // Proceed with updating the Mpesa till
            const query = `
                UPDATE mpesa_till
                SET ${updatedFields.join(", ")}
                WHERE mpesa_till_id = $${values.length + 1}
                RETURNING *;
            `;

            // Add the tillNumber to the values array
            values.push(tillNumber);

            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError("Failed to update Mpesa till: " + error, 500);
        }
    }

    async getAllMpesaTill(limit: number, offset: number): Promise<any> {
        try {
            const query = `
                SELECT * FROM mpesa_till
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
