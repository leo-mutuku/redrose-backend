import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { MenuRegister } from "../../entities/kitchen/MenuRegister";
import { IMenuRegisterRepository } from "../../interfaces/kitchen/IMenuRegisterRepository";

@injectable()
export class MenuRegisterRepository implements IMenuRegisterRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createMenuRegister({ name, description, created_by }: MenuRegister): Promise<MenuRegister> {
        try {
            const query = `
                INSERT INTO menu_register (name, description, created_by )
                VALUES ($1, $2, $3)
                RETURNING menu_register_id, name, description, created_by,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [name, description, created_by];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating menu register: ' + error, 500);
        }
    }

    async getMenuRegisters(limit: number, offset: number): Promise<MenuRegister[]> {
        try {
            const query = `
                SELECT menu_register_id, name, description, created_by,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM menu_register
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching menu registers: ' + error, 500);
        }
    }

    async getMenuRegister(id: number): Promise<MenuRegister> {
        try {
            const query = `
                SELECT menu_register_id, name, description, created_by,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM menu_register
                WHERE menu_register_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Menu register not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching menu register: ' + error, 500);
        }
    }

    async updateMenuRegister(id: number, menuRegister: Partial<MenuRegister>): Promise<MenuRegister> {
        try {
            let query = `UPDATE menu_register SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(menuRegister).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE menu_register_id = $${values.length + 1} RETURNING 
                menu_register_id,name, description, created_by ,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Menu register not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating menu register: ' + error, 500);
        }
    }
}
