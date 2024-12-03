import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IFoodProcessingInteractor } from "../../interfaces/kitchen/IFoodProcessingInteractor";
import { IFoodProcessingRepository } from "../../interfaces/kitchen/IFoodProcessingRepository";

@injectable()
export class FoodProcessingInteractor implements IFoodProcessingInteractor {
    private repository: IFoodProcessingRepository;

    constructor(@inject(INTERFACE_TYPE.FoodProcessingRepository) repository: IFoodProcessingRepository) {
        this.repository = repository;
    }

    async createFoodProcessing(input: any): Promise<any> {
        try {
            const result = await this.repository.createFoodProcessing(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in FoodProcessingInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create food processing. Please try again later.');
        }
    }

    async getFoodProcessing(id: number): Promise<any> {
        try {
            const result = await this.repository.getFoodProcessing(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve food processing with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in FoodProcessingInteractor. Please try again later.');
        }
    }

    async updateFoodProcessing(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateFoodProcessing(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating food processing in FoodProcessingInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update food processing. Please try again later.');
        }
    }

    async getFoodProcessings(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getFoodProcessings(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching food processings in FoodProcessingInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve food processings. Please try again later.');
        }
    }
}
