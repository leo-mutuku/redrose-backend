import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { ItemRegister } from "../../entities/store/ItemRegister"; // Assuming you have an ItemRegister entity
import { IItemRegisterRepository } from "../../interfaces/store/IItemRegisterRepository"; // Assuming the repository interface exists

@injectable()
export class ItemRegisterRepository implements IItemRegisterRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createRegister({ item_name, item_description, created_by }: ItemRegister): Promise<ItemRegister> {
        try {
            const query = `
            INSERT INTO item_register (item_name, item_description, created_by)
            VALUES ($1, $2, $3)
            RETURNING 
                item_id, 
                item_name, 
                item_description, 
                created_by, 
                created_at, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
                (SELECT first_name || ' ' || last_name AS fullname 
                 FROM users 
                 WHERE user_id = item_register.created_by) AS created_by_name
        `;
            const values = [item_name, item_description, created_by];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating item register: ' + error, 500);
        }
    }

    async getRegisters(limit: number, offset: number): Promise<ItemRegister[]> {
        try {
            const query = `
                 SELECT 
    ir.item_id, 
    ir.item_name, 
    ir.item_description, 
    TO_CHAR(ir.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    CASE
        WHEN u.first_name IS NOT NULL AND u.last_name IS NOT NULL THEN u.first_name || ' ' || u.last_name
        ELSE 'Unknown'  -- Return 'Unknown' if the user is not found
    END AS created_by_name
FROM item_register ir

LEFT JOIN users u ON ir.created_by = u.user_id

LIMIT $1 OFFSET $2
            `
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching item registers: ' + error, 500);
        }
    }

    async getRegister(id: number): Promise<ItemRegister> {
        try {
            const query = `
                 SELECT 
    ir.item_id, 
    ir.item_name, 
    ir.item_description, 
    TO_CHAR(ir.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    CASE
        WHEN u.first_name IS NOT NULL AND u.last_name IS NOT NULL THEN u.first_name || ' ' || u.last_name
        ELSE 'Unknown'  -- Return 'Unknown' if the user is not found
    END AS created_by_name
FROM item_register ir

LEFT JOIN users u ON ir.created_by = u.user_id
where ir.item_id = $1
LIMIT 20 OFFSET 0
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Item register not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching item register: ' + error, 500);
        }
    }

    async updateRegister(id: number, register: Partial<ItemRegister>): Promise<ItemRegister> {
        try {
            let query = `UPDATE item_register SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(register).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE item_id = $${values.length + 1} RETURNING 
                 item_id, 
                item_name, 
                item_description, 
                created_by, 
                created_at, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
                (SELECT first_name || ' ' || last_name AS fullname 
                 FROM users 
                 WHERE user_id = item_register.created_by) AS created_by_name`;
            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Item register not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating item register: ' + error, 500);
        }
    }
}
