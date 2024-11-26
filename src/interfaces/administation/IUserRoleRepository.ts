export interface IUserRoleRepository {
    assignUserRoles(id: number, roles: number[]): Promise<any>;
    updateUserRole(id: number, input: any): Promise<any>;
    getUserRole(id: number): Promise<any>;
    unassignRoles(id: number, roles: number[]): Promise<any>;
}