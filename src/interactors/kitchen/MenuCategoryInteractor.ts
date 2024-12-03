import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IMenuCategoryInteractor } from "../../interfaces/kitchen/IMenuCategoryInteractor";
import { IMenuCategoryRepository } from "../../interfaces/kitchen/IMenuCategoryRepository";

@injectable()
export class MenuCategoryInteractor implements IMenuCategoryInteractor {
    private repository: IMenuCategoryRepository;

    constructor(@inject(INTERFACE_TYPE.MenuCategoryRepository) repository: IMenuCategoryRepository) {
        this.repository = repository;
    }

    async createMenuCategory(input: any): Promise<any> {
        try {
            const result = await this.repository.createMenuCategory(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in MenuCategoryInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create menu category. Please try again later.');
        }
    }

    async getMenuCategory(id: number): Promise<any> {
        try {
            const result = await this.repository.getMenuCategory(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve menu category with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in MenuCategoryInteractor. Please try again later.');
        }
    }

    async updateMenuCategory(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateMenuCategory(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating menu category in MenuCategoryInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update menu category. Please try again later.');
        }
    }

    async getMenuCategories(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getMenuCategories(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching menu categories in MenuCategoryInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve menu categories. Please try again later.');
        }
    }
}
