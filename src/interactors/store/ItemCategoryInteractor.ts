import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IItemCategoryInteractor } from "../../interfaces/store/IItemcategoryInteractor";
import { IItemCategoryRepository } from "../../interfaces/store/IItemCategoryRepository";


@injectable()
export class ItemCategoryInteractor implements IItemCategoryInteractor {
    private repository: IItemCategoryRepository;

    constructor(
        @inject(INTERFACE_TYPE.ItemCategoryRepository) repository: IItemCategoryRepository
    ) {
        this.repository = repository;
    }

    async createItemCategory(input: any): Promise<any> {
        try {
            const result = await this.repository.createItemCategory(input);

            // Add additional business logic if necessary
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error occurred in ItemCategoryInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to create item category. Please try again later.");
        }
    }

    async getItemCategory(id: number): Promise<any> {
        try {
            const result = await this.repository.getItemCategory(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve item category with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Error occurred in ItemCategoryInteractor. Please try again later.");
        }
    }

    async updateItemCategory(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateItemCategory(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error updating item category in ItemCategoryInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to update item category. Please try again later.");
        }
    }

    async getItemCategories(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getItemCategories(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error fetching item categories in ItemCategoryInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to retrieve item categories. Please try again later.");
        }
    }
}
