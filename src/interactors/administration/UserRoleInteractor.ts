import { IUserRoleInteractor } from "../../interfaces/administation/IUserRoleInteractor";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { inject, injectable } from "inversify";

@injectable()
export class UserRoleInteractor implements IUserRoleInteractor {
    private repository: IUserRoleInteractor;
    constructor(@inject(INTERFACE_TYPE.UserRoleRepository) repository: IUserRoleInteractor) {
        this.repository = repository;
    }

    async createUserRole(input: any) {
        try {
            const result = await this.repository.createUserRole(input)
            return result

        } catch (error) {
            throw new AppError(
                `Failed to create user role. Reason: ${(error as AppError).message}`,
                (error as AppError).statusCode || 500
            );

        }
    }
    async getUserRole(id: number) {
        try {
            const result = await this.repository.getUserRole(id)
            return result

        } catch (error) {
            throw new AppError(
                `Failed to get user role. Reason: ${(error as AppError).message}`,
                (error as AppError).statusCode || 500
            );

        }
    }
    async updateUserRole(id: number, input: any) {
        try {
            const result = await this.repository.updateUserRole(id, input)
            return result
        }
        catch (error) {
            throw new AppError(
                `Failed to update user role. Reason: ${(error as AppError).message}`,
                (error as AppError).statusCode || 500
            );
        }
    }
    async getUserRoles(limit: number, offset: number) {
        try {
            const result = await this.repository.getUserRoles(limit, offset)
            return result
        }
        catch (error) {
            throw new AppError(
                `Failed to get user roles. Reason: ${(error as AppError).message}`,
                (error as AppError).statusCode || 500
            );
        }
    }

}