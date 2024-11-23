import { IRoleInteractor } from "../../interfaces/administation/IRoleInteracter";
import { IRoleRepository } from "../../interfaces/administation/IRoleRepository";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { inject, injectable } from "inversify";

@injectable()
export class RoleInteractor implements IRoleInteractor {
    private repository: IRoleRepository;
    constructor(@inject(INTERFACE_TYPE.RoleRepository) repository: IRoleRepository) {
        this.repository = repository;
    }
    async createRole(input: any): Promise<any> {
        try {
            const result = await this.repository.createRole(input)
            // do some business logic here
            // send email and sms
            return result
        } catch (error) {
            if (error instanceof AppError) {
                // Handle a specific error type if applicable
                throw new AppError('Error occured at the interactor', 500);
            }
            throw new Error('Failed to create role. Please try again later.');
        }
    }
    async getRole(id: number): Promise<any> {
        try {
            const result = await this.repository.getRole(id)
            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve role with ID ${id}. Reason: ${(error as AppError).message}`,
                    (error as AppError).statusCode || 500
                );
            }
            throw new Error('Error caught at interator class. Please try again later.');
        }
    }
    async updateRole(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateRole(id, input)
            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to update role with ID ${id}. Reason: ${(error as AppError).message}`,
                    (error as AppError).statusCode || 500
                );
            }
            throw new Error('Error caught at interator class. Please try again later.');
        }
    }
    async getRoles(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getRoles(limit, offset)
            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve roles. Reason: ${(error as AppError).message}`,
                    (error as AppError).statusCode || 500
                );
            }
            throw new Error('Error caught at interator class. Please try again later.');
        }
    }
}