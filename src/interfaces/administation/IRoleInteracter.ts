export interface IRoleInteractor {
    createRole(input: any): Promise<any>;
    getRole(id: number): Promise<any>;
    updateRole(id: number, input: any): Promise<any>;
    getRoles(limit: number, offset: number): Promise<any>;
}