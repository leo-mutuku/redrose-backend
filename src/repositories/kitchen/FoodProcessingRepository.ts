import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";

import { IFoodProcessingRepository } from "../../interfaces/kitchen/IFoodProcessingRepository";
import { FoodProcessing } from "../../entities/kitchen/FoodProcessing";

@injectable()
export class FoodProcessingRepository implements IFoodProcessingRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createFoodProcessing(): Promise<FoodProcessing> {
        try {
            const query = `
                INSERT INTO food_processing (process_name, description, start_date, end_date)
                VALUES ($1, $2, $3, $4)
                RETURNING process_id, process_name, description, 
                TO_CHAR(start_date, 'DD/MM/YYYY') AS start_date, 
                TO_CHAR(end_date, 'DD/MM/YYYY') AS end_date, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [

            ];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating food processing entry: ' + error, 500);
        }
    }

    async getFoodProcessings(limit: number, offset: number): Promise<FoodProcessing[]> {
        try {
            const query = `
                SELECT process_id, process_name, description, 
                TO_CHAR(start_date, 'DD/MM/YYYY') AS start_date, 
                TO_CHAR(end_date, 'DD/MM/YYYY') AS end_date,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM food_processing
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching food processing entries: ' + error, 500);
        }
    }

    async getFoodProcessing(id: number): Promise<FoodProcessing> {
        try {
            const query = `
                SELECT process_id, process_name, description, 
                TO_CHAR(start_date, 'DD/MM/YYYY') AS start_date, 
                TO_CHAR(end_date, 'DD/MM/YYYY') AS end_date,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM food_processing
                WHERE process_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Food processing entry not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching food processing entry: ' + error, 500);
        }
    }

    async updateFoodProcessing(id: number, foodProcessing: Partial<FoodProcessing>): Promise<FoodProcessing> {
        try {
            let query = `UPDATE food_processing SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(foodProcessing).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE process_id = $${values.length + 1} RETURNING 
                process_id, process_name, description, 
                TO_CHAR(start_date, 'DD/MM/YYYY') AS start_date, 
                TO_CHAR(end_date, 'DD/MM/YYYY') AS end_date,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Food processing entry not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating food processing entry: ' + error, 500);
        }
    }
}
