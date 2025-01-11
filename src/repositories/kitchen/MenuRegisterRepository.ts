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
            const query = `INSERT INTO menu_register (name, description, created_by )
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
            const query = `SELECT menu_register_id, name, description, created_by,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM menu_register
                ORDER BY created_at DESC
              
            `;

            const result = await this.client.query(query);

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
            // Define allowed fields for updates
            const allowedFields = ["name", "description", "created_by"]; // Replace with actual fields

            // Fetch the existing menu register record
            const existingRecordResult = await this.client.query('SELECT * FROM menu_register WHERE menu_register_id = $1', [id]);
            if (existingRecordResult.rows.length === 0) {
                throw new AppError(`Menu register with id ${id} not found`, 404);
            }

            const existingRecord = existingRecordResult.rows[0];

            // Filter fields that are both allowed and have changed
            const fieldsToUpdate = Object.keys(menuRegister).filter(
                (field) => allowedFields.includes(field) && menuRegister[field] !== existingRecord[field]
            );

            // If no fields are allowed or changed, return the existing record
            if (fieldsToUpdate.length === 0) {
                return existingRecord;
            }

            // Construct the dynamic query
            const setClauses = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`);
            const query = `UPDATE menu_register SET ${setClauses.join(', ')} WHERE menu_register_id = $${fieldsToUpdate.length + 1} RETURNING 
                menu_register_id, name, description, created_by,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            // Prepare the values array
            const values = [...fieldsToUpdate.map((field) => menuRegister[field]), id];

            // Execute the query
            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Menu register not found', 404);
            }

            // Return the updated record
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating menu register: ' + error, 500);
        }
    }

}
