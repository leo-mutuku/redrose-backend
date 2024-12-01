import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IItemRegisterInteractor } from "../../interfaces/store/IItemRegisterInteractor"; // Import Store Register Interactor
import { IItemRegisterRepository } from "../../interfaces/store/IItemRegisterRepository";

@injectable()
export class ItemRegisterInteractor implements IItemRegisterInteractor {
    private repository: IItemRegisterRepository;

    constructor(@inject(INTERFACE_TYPE.ItemRegisterRepository) repository: IItemRegisterRepository) {
        this.repository = repository;
    }

    async createRegister(input: any): Promise<any> {
        try {
            const result = await this.repository.createRegister(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in ItemRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create item register. Please try again later.');
        }
    }

    async getRegister(id: number): Promise<any> {
        try {
            const result = await this.repository.getRegister(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve item register with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in ItemRegisterInteractor. Please try again later.');
        }
    }

    async updateRegister(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateRegister(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating item register in ItemRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update item register. Please try again later.');
        }
    }

    async getRegisters(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getRegisters(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching item registers in ItemRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve item registers. Please try again later.');
        }
    }
}
