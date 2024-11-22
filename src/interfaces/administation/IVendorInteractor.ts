export interface IVendorInteractor {
    createVendor(input: any);
    updateVendor(id: number, input: any);
    getVendor(id: number);
    getVendors(limit: number, offset: number);
}