import { IVendorInteractor } from "../../interfaces/administation/IVendorInteractor";

export class VendorInteractor implements IVendorInteractor {
    createVendor(input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getVendor(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateVendor(id: number, input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getVendors(limit: number, offset: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
}