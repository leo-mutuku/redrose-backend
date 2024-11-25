export interface IUserRoleInteractor {
    assignUserRoles(id: number, input: any);
    getUserRole(id: number);
    updateUserRole(id: number, input: any);
    getUserRoles(limit: number, offset: number);
}