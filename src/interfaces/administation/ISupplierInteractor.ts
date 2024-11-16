export interface ISupplierInteractor {
    createSupplier(input: any): Promise<any>;
    getSupplier(id: number): Promise<any>;
    updateSupplier(id: number, input: any): Promise<any>;
    getSuppliers(limit: number, offset: number): Promise<any>;
}