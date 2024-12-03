import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { KitchenUnit } from "../../entities/kitchen/KitchenUnit";
import { IKitchenUnitRepository } from "../../interfaces/kitchen/IKitchenUnitRepository";

@injectable()
export class KitchenUnitRepository implements IKitchenUnitRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createKitchenUnit({ unit_name, description }: KitchenUnit): Promise<KitchenUnit> {
        try {
            const query = `
                INSERT INTO kitchen_unit (unit_name, description)
                VALUES ($1, $2)
                RETURNING kitchen_unit_id, unit_name, description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [unit_name, description];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating kitchen unit: ' + error, 500);
        }
    }

    async getKitchenUnits(limit: number, offset: number): Promise<KitchenUnit[]> {
        try {
            const query = `
                SELECT kitchen_unit_id, unit_name, description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM kitchen_unit
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching kitchen units: ' + error, 500);
        }
    }

    async getKitchenUnit(id: number): Promise<KitchenUnit> {
        try {
            const query = `
                SELECT kitchen_unit_id, unit_name, description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM kitchen_unit
                WHERE kitchen_unit_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Kitchen unit not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching kitchen unit: ' + error, 500);
        }
    }

    async updateKitchenUnit(id: number, kitchenUnit: Partial<KitchenUnit>): Promise<KitchenUnit> {
        try {
            let query = `UPDATE kitchen_unit SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(kitchenUnit).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE kitchen_unit_id = $${values.length + 1} RETURNING 
                kitchen_unit_id, unit_name, description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Kitchen unit not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating kitchen unit: ' + error, 500);
        }
    }
}
