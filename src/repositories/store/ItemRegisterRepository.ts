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
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                
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
        WHEN s.first_name IS NOT NULL AND s.last_name IS NOT NULL THEN s.first_name || ' ' || s.last_name
        ELSE 'Unknown'  -- Return 'Unknown' if the user is not found
    END AS created_by_name
FROM item_register ir

LEFT JOIN staff s ON ir.created_by = s.staff_id


            `
            // const values = [limit, offset];
            const result = await this.client.query(query);

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
        WHEN s.first_name IS NOT NULL AND s.last_name IS NOT NULL THEN s.first_name || ' ' || s.last_name
        ELSE 'Unknown'  -- Return 'Unknown' if the user is not found
    END AS created_by_name
FROM item_register ir

LEFT JOIN staff s ON ir.created_by = s.staff_id
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
            // Define allowed fields for updates
            const allowedFields = ["item_name", "item_description"]; // Replace with actual fields

            // Fetch the existing register record
            const existingRecordResult = await this.client.query('SELECT * FROM item_register WHERE item_id = $1', [id]);
            if (existingRecordResult.rows.length === 0) {
                throw new AppError(`Register with id ${id} not found`, 404);
            }

            const existingRecord = existingRecordResult.rows[0];

            // Filter fields that are both allowed and have changed
            const fieldsToUpdate = Object.keys(register).filter(
                (field) => allowedFields.includes(field) && register[field] !== existingRecord[field]
            );

            // If no fields are allowed or changed, return the existing record
            if (fieldsToUpdate.length === 0) {
                return existingRecord;
            }

            // Construct the dynamic query
            const setClauses = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`);
            const query = `UPDATE item_register SET ${setClauses.join(', ')} WHERE item_id = $${fieldsToUpdate.length + 1} RETURNING *`;

            // Prepare the values array
            const values = [...fieldsToUpdate.map((field) => register[field]), id];

            // Execute the query
            const result = await this.client.query(query, values);

            // Return the updated record
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating item register: ' + error, 500);
        }
    }

}
