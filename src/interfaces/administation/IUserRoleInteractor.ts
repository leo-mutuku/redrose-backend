export interface IUserRoleInteractor {
    assignUserRoles(id: number, roles: number[]);
    getUserRole(id: number);
    updateUserRole(id: number, input: any);
    unassignRoles(id: number, roles: number[]);
}