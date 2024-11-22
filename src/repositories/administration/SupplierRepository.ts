import { Supplier } from "../../entities/administration/Suppliers";
import { ISupplierRepository } from "../../interfaces/administation/ISupplierRepository";


export class SupplierRepository implements ISupplierRepository {
    createStaff(supplier: Supplier): Promise<Supplier> {
        throw new Error("Method not implemented.");
    }
    getStaff(username: string): Promise<Supplier> {
        throw new Error("Method not implemented.");
    }
    getStaffs(supplier: Supplier): Promise<Supplier> {
        throw new Error("Method not implemented.");
    }
    updateStaff(id: number, supplier: Supplier): Promise<Supplier> {
        throw new Error("Method not implemented.");
    }

}