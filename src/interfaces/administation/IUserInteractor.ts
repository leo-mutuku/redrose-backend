export interface IUserInteractor {
    createUser(input: any): Promise<any>;
    getUser(id: number): Promise<any>;
    updateUser(id: number, input: any): Promise<any>;
    getVendors(limit: number, offset: number): Promise<any>;
}