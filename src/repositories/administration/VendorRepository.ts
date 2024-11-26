import { IVendorRepository } from "../../interfaces/administation/IVendorRepository";
import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { Vendor } from "../../entities/administration/Vendors";

interface VendorInput {
    vendor_name?: string;
    vendor_address?: string;
    vendor_phone?: string;
    vendor_email?: string;
}

@injectable()
export class VendorRepository implements IVendorRepository {
    private client: Pool
    constructor() {
        this.client = pgClient()
    }
    async createVendor(vendor: Vendor): Promise<any> {
        try {
            const query = `INSERT INTO vendors(vendor_name,phone, created_by) 
            VALUES($1,$2, $3) RETURNING *`
            const values = [vendor.vendor_name, vendor.phone, vendor.created_by]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while creating vendor: " + error, 400)

        }
    }
    async updateVendor(id: number, input: any): Promise<any> {
        try {
            // Step 1: Fetch the existing vendor details from the database
            const existingQuery = 'SELECT * FROM vendors WHERE vendor_id = $1';
            const existingResult = await this.client.query(existingQuery, [id]);

            if (existingResult.rows.length === 0) {
                throw new AppError('Vendor not found', 404);
            }

            const existingData = existingResult.rows[0];

            // Step 2: Compare input values with existing values
            const updates: string[] = [];
            const values: any[] = [];
            let index = 1; // Positional parameter index for PostgreSQL ($1, $2, ...)

            for (const key in input) {
                if (Object.prototype.hasOwnProperty.call(input, key)) {
                    const value = input[key as keyof VendorInput];

                    // Check if the value is different from the existing value
                    if (value !== undefined && value !== existingData[key]) {
                        updates.push(`${key} = $${index}`);
                        values.push(value);
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
                UPDATE vendors
                SET ${updates.join(', ')}
                WHERE vendor_id = $${index}
                RETURNING *;
            `;
            values.push(id); // Add the vendor_id as the last parameter

            const result = await this.client.query(updateQuery, values);

            // Step 5: Return the updated record
            return result.rows[0];
        } catch (error) {
            throw new AppError("Error while updating vendor: " + error, 400)

        }
    }
    async getVendor(id: number): Promise<any> {
        try {
            const query = `SELECT * FROM vendors WHERE vendor_id = $1`
            const values = [id]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while getting vendor: " + error, 400)

        }
    }
    async getVendors(limit: number, offset: number): Promise<any> {
        try {
            const query = `SELECT * FROM vendors LIMIT $1 OFFSET $2`
            const values = [limit, offset]
            const result = await this.client.query(query, values)
            return result.rows

        } catch (error) {
            throw new AppError("Error while getting vendors: " + error, 400)

        }
    }
}