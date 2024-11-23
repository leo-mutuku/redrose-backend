import { ISupplierInteractor } from "../../interfaces/administation/ISupplierInteractor";
import { ISupplierRepository } from "../../interfaces/administation/ISupplierRepository";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { inject, injectable } from "inversify";

@injectable()
export class SupplierInteractor implements ISupplierInteractor {
    private repository: ISupplierRepository;
    constructor(@inject(INTERFACE_TYPE.SupplierRepository) repository: ISupplierRepository) {
        this.repository = repository;
    }

    async createSupplier(input: any): Promise<any> {
        try {
            const result = await this.repository.createSupplier(input)
            // do some business logic here
            // send email and sms
            return result
        } catch (error) {
            if (error instanceof AppError) {
                // Handle a specific error type if applicable
                throw new AppError('Error occured at the interactor', 500);
            }
            throw new Error('Failed to create supplier. Please try again later.');
        }
    }
    async getSupplier(id: number): Promise<any> {
        try {
            const result = await this.repository.getSupplier(id)
            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve supplier with ID ${id}. Reason: ${(error as AppError).message}`,
                    (error as AppError).statusCode || 500
                );
            }
            throw new Error('Error caught at interator class. Please try again later.');
        }
    }
    async updateSupplier(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateSupplier(id, input)
            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to update supplier with ID ${id}. Reason: ${(error as AppError).message}`,
                    (error as AppError).statusCode || 500
                );
            }
            throw new Error('Error caught at interator class. Please try again later.');
        }
    }
    async getSuppliers(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getSuppliers(limit, offset)
            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve suppliers. Reason: ${(error as AppError).message}`,
                    (error as AppError).statusCode || 500
                );
            }
            throw new Error('Error caught at interator class. Please try again later.');
        }
    }
}