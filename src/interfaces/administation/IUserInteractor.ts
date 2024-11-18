export interface IUserInteractor {
    createUser(input: any);
    getUser(id: number);
    updateUser(id: number, input: any);
    getUsers(limit: number, offset: number);
}