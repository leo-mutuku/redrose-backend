import { IVendorRepository } from "../../interfaces/administation/IVendorRepository";
import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";


export class VendorRepository implements IVendorRepository {
    createVendor(input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateVendor(id: number, input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getVendor(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getVendors(limit: number, offset: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
}