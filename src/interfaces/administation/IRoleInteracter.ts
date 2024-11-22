export interface IRoleInteractor {
    createRole(input: any);
    getRole(id: number);
    updateRole(id: number, input: any);
    getRoles(limit: number, offset: number);
}