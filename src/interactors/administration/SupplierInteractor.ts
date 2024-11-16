import { ISupplierInteractor } from "../../interfaces/administation/ISupplierInteractor";

export class SupplierInteractor implements ISupplierInteractor {

    createSupplier(input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getSupplier(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateSupplier(id: number, input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getSuppliers(limit: number, offset: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
}