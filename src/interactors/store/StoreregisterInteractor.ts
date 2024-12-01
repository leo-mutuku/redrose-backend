import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";

import { IStoreRegisterInteractor } from "../../interfaces/store/IStoreRegisterInteractor";
import { IStoreRegisterRepository } from "../../interfaces/store/IStoreRegisterrepository";

@injectable()
export class StoreRegisterInteractor implements IStoreRegisterInteractor {
    private repository: IStoreRegisterRepository;

    constructor(@inject(INTERFACE_TYPE.StoreRegisterRepository) repository: IStoreRegisterRepository) {
        this.repository = repository;
    }

    async createRegister(input: any): Promise<any> {
        try {
            const result = await this.repository.createRegister(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in StoreRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create store register. Please try again later.');
        }
    }

    async getRegister(id: number): Promise<any> {
        try {
            const result = await this.repository.getRegister(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve store register with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in StoreRegisterInteractor. Please try again later.');
        }
    }

    async updateRegister(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateRegister(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating store register in StoreRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update store register. Please try again later.');
        }
    }

    async getRegisters(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getRegisters(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching store registers in StoreRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve store registers. Please try again later.');
        }
    }
}
