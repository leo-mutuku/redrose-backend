export interface IUserRoleInteractor {
    createUserRole(input: any);
    getUserRole(id: number);
    updateUserRole(id: number, input: any);
    getUserRoles(limit: number, offset: number);
}