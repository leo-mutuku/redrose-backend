export interface IUserRoleInteractor {
    createUserRole(input: any): Promise<any>;
    getUserRole(id: number): Promise<any>;
    updateUserRole(id: number, input: any): Promise<any>;
    getRoles(limit: number, offset: number): Promise<any>;
}