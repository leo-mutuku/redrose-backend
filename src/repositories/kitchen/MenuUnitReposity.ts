import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IMenuUnitRepository } from "../../interfaces/kitchen/IMenuUnitRepository";
import { MenuUnit } from "../../entities/kitchen/MenuUnit";

@injectable()
export class MenuUnitRepository implements IMenuUnitRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createMenuUnit({ unit_name, unit_abbr, value }: MenuUnit): Promise<MenuUnit> {
        try {
            const query = `
                INSERT INTO menu_unit (unit_name, unit_abbr, value)
                VALUES ($1, $2, $3)
                RETURNING menu_unit_id, unit_name, unit_abbr, value,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [unit_name, unit_abbr, value];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating menu unit: ' + error, 500);
        }
    }

    async getMenuUnits(limit: number, offset: number): Promise<MenuUnit[]> {
        try {
            const query = `
                SELECT menu_unit_id,unit_name, unit_abbr, value,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM menu_unit
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching menu units: ' + error, 500);
        }
    }

    async getMenuUnit(id: number): Promise<MenuUnit> {
        try {
            const query = `
                SELECT menu_unit_id, unit_name, unit_abbr, value,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM menu_unit
                WHERE menu_unit_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Menu unit not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching menu unit: ' + error, 500);
        }
    }

    async updateMenuUnit(id: number, menuUnit: Partial<MenuUnit>): Promise<MenuUnit> {
        try {
            let query = `UPDATE menu_unit SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(menuUnit).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE menu_unit_id = $${values.length + 1} RETURNING 
                menu_unit_id, unit_name, unit_abbr, value,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Menu unit not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating menu unit: ' + error, 500);
        }
    }
}
