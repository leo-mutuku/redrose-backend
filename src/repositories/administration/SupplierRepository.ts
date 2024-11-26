import { Supplier } from "../../entities/administration/Suppliers";
import { ISupplierRepository } from "../../interfaces/administation/ISupplierRepository";
import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";

export type SupplierInput = {
    supplier_name?: string;
    phone?: string;
};


@injectable()
export class SupplierRepository implements ISupplierRepository {
    private client: Pool
    constructor() {
        this.client = pgClient()
    }
    async createSupplier(supplier: Supplier): Promise<Supplier> {
        try {
            const query =
                `INSERT INTO suppliers(supplier_name,phone, created_by) VALUES($1, $2, $3)
              RETURNING *`
            const values = [supplier.supplier_name, supplier.phone, supplier.created_by]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while creating supplier: " + error, 400)

        }
    }
    async getSuppliers(limit: number, offset: number): Promise<Supplier[]> {
        try {
            const query =
                `SELECT * FROM suppliers LIMIT $1 OFFSET $2`
            const values = [limit, offset]
            const result = await this.client.query(query, values)
            return result.rows

        } catch (error) {
            throw new AppError("Error while getting suppliers: " + error, 400)

        }
    }
    async getSupplier(id: number): Promise<Supplier> {
        try {
            const query =
                `SELECT * FROM suppliers WHERE supplier_id = $1`
            const values = [id]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while getting supplier: " + error, 400)

        }
    }

    async updateSupplier(id: number, supplier: Supplier): Promise<Supplier> {
        try {
            // Step 1: Fetch the existing supplier details from the database
            const existingQuery = `SELECT * FROM suppliers WHERE supplier_id = $1`;
            const existingResult = await this.client.query(existingQuery, [id]);

            if (existingResult.rows.length === 0) {
                throw new AppError('Supplier not found', 404);
            }

            const existingData = existingResult.rows[0];

            // Step 2: Dynamically construct the UPDATE query
            const updates: string[] = [];
            const values: any[] = [];
            let index = 1; // Positional parameter index for PostgreSQL ($1, $2, ...)

            for (const key in supplier) {
                if (Object.prototype.hasOwnProperty.call(supplier, key)) {
                    const newValue = supplier[key as keyof SupplierInput];
                    if (newValue !== undefined && newValue !== existingData[key]) {
                        updates.push(`${key} = $${index}`);
                        values.push(newValue);
                        index++;
                    }
                }
            }

            // Step 3: If no fields have changed, throw an error
            if (updates.length === 0) {
                throw new AppError('No fields were changed', 400);
            }

            // Step 4: Construct and execute the UPDATE query
            const updateQuery = `
                UPDATE suppliers
                SET ${updates.join(', ')}
                WHERE supplier_id = $${index}
                RETURNING *;
            `;
            values.push(id); // Add the supplier_id as the last parameter

            const result = await this.client.query(updateQuery, values);

            // Step 5: Return the updated record
            return result.rows[0];
        } catch (error) {
            throw new AppError("Error while updating supplier: " + error, 400)

        }
    }



}