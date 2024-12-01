import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { StoreRegister } from "../../entities/store/StoreRegister";  // Adjust the import based on your actual entity
import { IStoreRegisterRepository } from "../../interfaces/store/IStoreRegisterRepository";



@injectable()
export class StoreRegisterRepository implements IStoreRegisterRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createRegister({ store_name, location }: StoreRegister): Promise<StoreRegister> {
        try {
            const query = `
                INSERT INTO store_register (store_name, location)
                VALUES ($1, $2)
                RETURNING store_id, store_name, location, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [store_name, location];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating store register: ' + error, 500);
        }
    }

    async getRegisters(limit: number, offset: number): Promise<StoreRegister[]> {
        try {
            const query = `
                SELECT store_id, store_name, location,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM store_register
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching store registers: ' + error, 500);
        }
    }

    async getRegister(id: number): Promise<StoreRegister> {
        try {
            const query = `
                SELECT store_id, store_name, location,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM store_register
                WHERE store_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Store register not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching store register: ' + error, 500);
        }
    }

    async updateRegister(id: number, storeRegister: Partial<StoreRegister>): Promise<StoreRegister> {
        try {
            let query = `UPDATE store_register SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(storeRegister).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE store_id = $${values.length + 1} RETURNING 
                store_id, store_name, location,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Store register not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating store register: ' + error, 500);
        }
    }
}
