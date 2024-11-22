export interface IUserRoleRepository {
    createUserRole(input: any): Promise<any>;
    updateUserRole(id: number, input: any): Promise<any>;
    getUserRole(id: number): Promise<any>;
    getUserRoles(limit: number, offset: number): Promise<any>;
}