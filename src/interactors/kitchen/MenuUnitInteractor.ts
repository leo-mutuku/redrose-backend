import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IMenuUnitInteractor } from "../../interfaces/kitchen/ImenuUnitInteractor";
import { IMenuUnitRepository } from "../../interfaces/kitchen/IMenuUnitRepository";


@injectable()
export class MenuUnitInteractor implements IMenuUnitInteractor {
    private repository: IMenuUnitRepository;

    constructor(@inject(INTERFACE_TYPE.MenuUnitRepository) repository: IMenuUnitRepository) {
        this.repository = repository;
    }

    async createMenuUnit(input: any): Promise<any> {
        try {
            const result = await this.repository.createMenuUnit(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in MenuUnitInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create menu unit. Please try again later.');
        }
    }

    async getMenuUnit(id: number): Promise<any> {
        try {
            const result = await this.repository.getMenuUnit(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve menu unit with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in MenuUnitInteractor. Please try again later.');
        }
    }

    async updateMenuUnit(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateMenuUnit(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating menu unit in MenuUnitInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update menu unit. Please try again later.');
        }
    }

    async getMenuUnits(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getMenuUnits(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching menu units in MenuUnitInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve menu units. Please try again later.');
        }
    }
}
