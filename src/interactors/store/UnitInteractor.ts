import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IUnitRepository } from "../../interfaces/store/IUnitRepository";
import { IUnitInteractor } from "../../interfaces/store/IUnitInteractor";

@injectable()
export class UnitInteractor implements IUnitInteractor {
    private repository: IUnitRepository;

    constructor(@inject(INTERFACE_TYPE.UnitRepository) repository: IUnitRepository) {
        this.repository = repository;
    }

    async createUnit(input: any): Promise<any> {
        try {
            const result = await this.repository.createUnit(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in UnitInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create unit. Please try again later.');
        }
    }

    async getUnit(id: number): Promise<any> {
        try {
            const result = await this.repository.getUnit(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve unit with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in UnitInteractor. Please try again later.');
        }
    }

    async updateUnit(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateUnit(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating unit in UnitInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update unit. Please try again later.');
        }
    }

    async getUnits(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getUnits(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching units in UnitInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve units. Please try again later.');
        }
    }
}
