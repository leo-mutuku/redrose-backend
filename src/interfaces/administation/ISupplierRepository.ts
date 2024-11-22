import { Supplier } from "../../entities/administration/Suppliers"
export interface ISupplierRepository {
    createSupplier(supplier: Supplier): Promise<Supplier>
    getSuppliers(limit: number, offset: number): Promise<Supplier>
    getSupplier(supplier_id: number): Promise<Supplier>
    updateSupplier(id: number, supplier: Supplier): Promise<Supplier>
}