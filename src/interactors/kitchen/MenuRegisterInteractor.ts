import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IMenuRegisterInteractor } from "../../interfaces/kitchen/IMenuRegisterInteractor";
import { IMenuRegisterRepository } from "../../interfaces/kitchen/IMenuRegisterRepository";

@injectable()
export class MenuRegisterInteractor implements IMenuRegisterInteractor {
    private repository: IMenuRegisterRepository;

    constructor(@inject(INTERFACE_TYPE.MenuRegisterRepository) repository: IMenuRegisterRepository) {
        this.repository = repository;
    }

    async createMenuRegister(input: any): Promise<any> {
        try {
            const result = await this.repository.createMenuRegister(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in MenuRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create menu register. Please try again later.');
        }
    }

    async getMenuRegister(id: number): Promise<any> {
        try {
            const result = await this.repository.getMenuRegister(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve menu register with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in MenuRegisterInteractor. Please try again later.');
        }
    }

    async updateMenuRegister(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateMenuRegister(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating menu register in MenuRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update menu register. Please try again later.');
        }
    }

    async getMenuRegisters(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getMenuRegisters(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching menu registers in MenuRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve menu registers. Please try again later.');
        }
    }
}
