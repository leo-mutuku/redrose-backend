import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { Unit } from "../../entities/store/Unit";
import { IUnitRepository } from "../../interfaces/store/IUnitRepository";


@injectable()
export class UnitRepository implements IUnitRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createUnit({ standard_unit_name, standard_unit_value, other_unit_name, other_unit_value }: Unit): Promise<Unit> {
        try {
            const query = `
                INSERT INTO item_unit (standard_unit_name, standard_unit_value,other_unit_name,other_unit_value)
                VALUES ($1, $2, $3,$4)
                RETURNING unit_id,
                standard_unit_name, standard_unit_value,other_unit_name,other_unit_value, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [standard_unit_name, standard_unit_value, other_unit_name, other_unit_value];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating unit: ' + error, 500);
        }
    }

    async getUnits(limit: number, offset: number): Promise<Unit[]> {
        try {
            const query = `
                SELECT unit_id,
                standard_unit_name, standard_unit_value,other_unit_name,other_unit_value,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM item_unit
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching units: ' + error, 500);
        }
    }

    async getUnit(id: number): Promise<Unit> {
        try {
            const query = `
                SELECT unit_id,
                standard_unit_name, standard_unit_value,other_unit_name,other_unit_value,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM item_unit
                WHERE unit_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Unit not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching unit: ' + error, 500);
        }
    }

    async updateUnit(id: number, unit: Partial<Unit>): Promise<Unit> {
        try {
            let query = `UPDATE item_unit SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(unit).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE unit_id = $${values.length + 1} RETURNING 
                unit_id, 
                standard_unit_name, standard_unit_value,other_unit_name,other_unit_value,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Unit not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating unit: ' + error, 500);
        }
    }
}
