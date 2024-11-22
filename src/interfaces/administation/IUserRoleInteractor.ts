export interface IUserRoleInteractor {
    createUserRole(input: any);
    getUserRole(id: number);
    updateUserRole(id: number, input: any);
    getRoles(limit: number, offset: number);
}