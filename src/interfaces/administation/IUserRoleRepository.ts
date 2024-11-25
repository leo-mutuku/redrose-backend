export interface IUserRoleRepository {
    assignUserRoles(id: number, input: any): Promise<any>;
    updateUserRole(id: number, input: any): Promise<any>;
    getUserRole(id: number): Promise<any>;
    unassignRoles(id: number, input: any): Promise<any>;
}