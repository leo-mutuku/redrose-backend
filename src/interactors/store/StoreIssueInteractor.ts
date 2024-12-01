import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IStoreIssueInteractor } from "../../interfaces/store/IStoreIssueInteractor";
import { IStoreIssueRepository } from "../../interfaces/store/IStoreIssueRepository";

@injectable()
export class StoreIssueInteractor implements IStoreIssueInteractor {
    private repository: IStoreIssueRepository;

    constructor(@inject(INTERFACE_TYPE.StoreIssueRepository) repository: IStoreIssueRepository) {
        this.repository = repository;
    }

    async createStoreIssue(input: any): Promise<any> {
        try {
            const result = await this.repository.createStoreIssue(input);

            // Additional business logic can be added here
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in StoreIssueInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create store issue. Please try again later.');
        }
    }

    async getStoreIssue(id: number): Promise<any> {
        try {
            const result = await this.repository.getStoreIssue(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve store issue with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in StoreIssueInteractor. Please try again later.');
        }
    }

    async updateStoreIssue(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateStoreIssue(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating store issue in StoreIssueInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update store issue. Please try again later.');
        }
    }

    async getStoreIssues(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getStoreIssues(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching store issues in StoreIssueInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve store issues. Please try again later.');
        }
    }
}
