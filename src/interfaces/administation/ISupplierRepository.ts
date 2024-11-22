import { Supplier } from "../../entities/administration/Suppliers"
export interface ISupplierRepository {
    createStaff(supplier: Supplier): Promise<Supplier>
    getStaff(username: string): Promise<Supplier>
    getStaffs(supplier: Supplier): Promise<Supplier>
    updateStaff(id: number, supplier: Supplier): Promise<Supplier>
}