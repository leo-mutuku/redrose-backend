import { IUserInteractor } from "../../interfaces/administation/IUserInteractor";
import { IUserRepository } from "../../interfaces/administation/IUserRepository";

export class UserInteractor implements IUserInteractor {

    private repository: IUserRepository

    constructor(repository: IUserRepository) {
        this.repository = repository
    }

    async createUser(input: any): Promise<any> {
        try {
            const result = await this.repository.createUser(input)
            return result
        } catch (error) {
            throw error
        }
    }
    async getUser(id: number): Promise<any> {
        try {
            const result = await this.repository.getUser(id)
            return result
        } catch (error) {
            throw error
        }
    }
    async updateUser(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateUser(id, input)
            return result
        } catch (error) {
            throw error
        }
    }
    async getUsers(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getUsers(limit, offset)
            return result
        } catch (error) {
            throw error
        }
    }



}