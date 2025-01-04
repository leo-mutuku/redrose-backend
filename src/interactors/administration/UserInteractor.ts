import { inject, injectable } from "inversify";
import { IUserInteractor } from "../../interfaces/administation/IUserInteractor";
import { IUserRepository } from "../../interfaces/administation/IUserRepository";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";



@injectable()
export class UserInteractor implements IUserInteractor {

    private repository: IUserRepository


    constructor(@inject(INTERFACE_TYPE.UserRepository) repository: IUserRepository) {
        this.repository = repository
    }

    async createUser(input: any): Promise<any> {
        try {
            const result = await this.repository.createUser(input)

            // do some business logic here
            // send email and sms


            return result
        } catch (error) {
            if (error instanceof AppError) {

                // Handle a specific error type if applicable
                throw new AppError('Error occured at the interactor' + error, 500);
            }
            throw new Error('Failed to create user. Please try again later.');
        }
    }
    async getUser(id: number): Promise<any> {
        try {


            const result = await this.repository.getUser(id)

            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    ` ${(error as AppError).message}`,
                    (error as AppError).statusCode || 500
                );
            }

            throw new Error(' Please try again later.');
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
            throw new AppError("Error" + error, 400)
        }
    }

    async changePassword(input: any) {
        try {
            const result = await this.repository.changePassword(input)
            return result

        } catch (error) {
            throw new AppError("Error" + error, 400)

        }
    }



}