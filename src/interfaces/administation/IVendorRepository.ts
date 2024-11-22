export interface IVendorRepository {
    createVendor(input: any): Promise<any>;
    updateVendor(id: number, input: any): Promise<any>;
    getVendor(id: number): Promise<any>;
    getVendors(limit: number, offset: number): Promise<any>;
}