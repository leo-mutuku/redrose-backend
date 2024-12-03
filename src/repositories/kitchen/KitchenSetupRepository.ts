import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { KitchenSetup } from "../../entities/kitchen/KitchenSetup";
import { IKitchenSetupRepository } from "../../interfaces/kitchen/IKitchenSetupRepository";

@injectable()
export class KitchenSetupRepository implements IKitchenSetupRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createKitchenSetup({ setup_name, setup_description }: KitchenSetup): Promise<KitchenSetup> {
        try {
            const query = `
                INSERT INTO kitchen_setup (setup_name, setup_description)
                VALUES ($1, $2)
                RETURNING kitchen_setup_id, setup_name, setup_description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [setup_name, setup_description];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating kitchen setup: ' + error, 500);
        }
    }

    async getKitchenSetups(limit: number, offset: number): Promise<KitchenSetup[]> {
        try {
            const query = `
                SELECT kitchen_setup_id, setup_name, setup_description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM kitchen_setup
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching kitchen setups: ' + error, 500);
        }
    }

    async getKitchenSetup(id: number): Promise<KitchenSetup> {
        try {
            const query = `
                SELECT kitchen_setup_id, setup_name, setup_description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM kitchen_setup
                WHERE kitchen_setup_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Kitchen setup not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching kitchen setup: ' + error, 500);
        }
    }

    async updateKitchenSetup(id: number, kitchenSetup: Partial<KitchenSetup>): Promise<KitchenSetup> {
        try {
            let query = `UPDATE kitchen_setup SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(kitchenSetup).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE kitchen_setup_id = $${values.length + 1} RETURNING 
                kitchen_setup_id, setup_name, setup_description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Kitchen setup not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating kitchen setup: ' + error, 500);
        }
    }
}
