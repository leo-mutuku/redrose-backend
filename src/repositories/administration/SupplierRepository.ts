import { Supplier } from "../../entities/administration/Suppliers";
import { ISupplierRepository } from "../../interfaces/administation/ISupplierRepository";
import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";


@injectable()
export class SupplierRepository implements ISupplierRepository {
    private client: Pool
    constructor() {
        this.client = pgClient()
    }
    async createSupplier(supplier: Supplier): Promise<Supplier> {
        try {
            const query =
                `INSERT INTO suppliers(supplier_name,phone) VALUES($1, $2, )
              RETURNING *`
            const values = [supplier.supplier_name, supplier.phone,]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while creating supplier: " + error, 400)

        }
    }
    getSuppliers(limit: number, offset: number): Promise<Supplier> {
        throw new Error("Method not implemented.");
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
            const query =
                `UPDATE suppliers SET supplier_name = $1, phone = $2 WHERE supplier_id = $3
              RETURNING *`
            const values = [supplier.supplier_name, supplier.phone, id]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while updating supplier: " + error, 400)

        }
    }



}