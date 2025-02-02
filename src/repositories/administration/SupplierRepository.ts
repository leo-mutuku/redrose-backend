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

            console.log(supplier)
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

    async updateSupplier(supplier_id: number, supplier: Supplier): Promise<Supplier> {
        try {
            // Define allowed fields for updates
            const allowedFields = ["suppplier_name", "address", "email", "phone"]; // Add allowed fields here

            // Fetch the existing supplier record
            const existingRecordResult = await this.client.query(
                'SELECT * FROM suppliers WHERE supplier_id = $1',
                [supplier_id]
            );

            if (existingRecordResult.rows.length === 0) {
                throw new AppError(`Supplier with id ${supplier_id} not found`, 404);
            }

            const existingRecord = existingRecordResult.rows[0];

            // Filter fields that are both allowed and have changed
            const fieldsToUpdate = Object.keys(supplier).filter(
                (field) => allowedFields.includes(field) && supplier[field] !== existingRecord[field]
            );

            // If no fields are allowed or changed, return the existing record
            if (fieldsToUpdate.length === 0) {
                return existingRecord;
            }

            // Construct the dynamic query
            const setClauses = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`);
            const query = `UPDATE suppliers SET ${setClauses.join(', ')} WHERE supplier_id = $${fieldsToUpdate.length + 1} RETURNING *`;

            // Prepare the values array
            const values = [...fieldsToUpdate.map((field) => supplier[field]), supplier_id];

            // Execute the query
            const result = await this.client.query(query, values);

            // Return the updated record
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating supplier: ' + error, 400);
        }
    }



}