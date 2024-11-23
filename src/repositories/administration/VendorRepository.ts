import { IVendorRepository } from "../../interfaces/administation/IVendorRepository";
import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { Vendor } from "../../entities/administration/Vendors";

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
            const query = `UPDATE vendors SET vendor_name = $1, vendor_address = $2, vendor_phone = $3, vendor_email = $4 WHERE vendor_id = $5 RETURNING *`
            const values = [input.vendor_name, input.vendor_address, input.vendor_phone, input.vendor_email, id]
            const result = await this.client.query(query, values)
            return result.rows[0]

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