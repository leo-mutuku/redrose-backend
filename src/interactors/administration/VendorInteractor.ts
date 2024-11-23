import { IVendorInteractor } from "../../interfaces/administation/IVendorInteractor";
import { IVendorRepository } from "../../interfaces/administation/IVendorRepository";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { inject, injectable } from "inversify";

@injectable()
export class VendorInteractor implements IVendorInteractor {
    private repository: IVendorRepository;
    constructor(@inject
        (INTERFACE_TYPE.VendorRepository) repository: IVendorRepository) {
        this.repository = repository;
    }

    async createVendor(input: any): Promise<any> {
        try {
            const vendor = await this.repository.createVendor(input);
            return vendor;
        } catch (error) {
            throw new AppError("Failed to create vendor" + error, 500);
        }
    }
    async getVendor(id: number): Promise<any> {
        try {
            const vendor = await this.repository.getVendor(id);
            return vendor;
        } catch (error) {
            throw new AppError("Failed to get vendor" + error, 500);
        }
    }
    async updateVendor(id: number, input: any): Promise<any> {
        try {
            const vendor = await this.repository.updateVendor(id, input);
            return vendor;
        } catch (error) {
            throw new AppError("Failed to update vendor" + error, 500);
        }
    }
    async getVendors(limit: number, offset: number): Promise<any> {
        try {
            const vendors = await this.repository.getVendors(limit, offset);
            return vendors;
        } catch (error) {
            throw new AppError("Failed to get vendors" + error, 500);
        }
    }
}