export interface IUserRoleInteractor {
    assignUserRoles(id: number, input: any);
    getUserRole(id: number);
    updateUserRole(id: number, input: any);
    unassignRoles(id: number, input: any);
}