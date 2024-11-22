export interface ISupplierInteractor {
    createSupplier(input: any);
    getSupplier(id: number);
    updateSupplier(id: number, input: any);
    getSuppliers(limit: number, offset: number);
}