import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IMenuItemInteractor } from "../../interfaces/kitchen/IMenuItemInteractor";
import { IMenuItemRepository } from "../../interfaces/kitchen/IMenuItemRepository";

@injectable()
export class MenuItemInteractor implements IMenuItemInteractor {
    private repository: IMenuItemRepository;

    constructor(@inject(INTERFACE_TYPE.MenuItemRepository) repository: IMenuItemRepository) {
        this.repository = repository;
    }

    async createMenuItem(input: any): Promise<any> {
        try {
            const result = await this.repository.createMenuItem(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in MenuItemInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create menu item. Please try again later.');
        }
    }

    async getMenuItem(id: number): Promise<any> {
        try {
            const result = await this.repository.getMenuItem(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve menu item with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in MenuItemInteractor. Please try again later.');
        }
    }

    async updateMenuItem(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateMenuItem(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating menu item in MenuItemInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update menu item. Please try again later.');
        }
    }

    async getMenuItems(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getMenuItems(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching menu items in MenuItemInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve menu items. Please try again later.');
        }
    }

    async getmenuTracking() {
        try {
            const result = await this.repository.getmenuTracking()
            return result

        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching menu items in MenuItemInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve menu items. Please try again later.');

        }
    }

    async deleteMenuItem(id: number): Promise<any> {
        try {
            const result = await this.repository.deleteMenuItem(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error deleting menu item in MenuItemInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to delete menu item. Please try again later.');
        }
    }
}
