import { User } from "../../entities/administration/Users"
export interface IUserRepository {
    createUser(user: User): Promise<User>
    getUsers(limit: number, offset: number): Promise<User[]>
    getUser(id: number): Promise<User>
    updateUser(id: number, user: User): Promise<User>
    changePassword(input: any): Promise<User>
}