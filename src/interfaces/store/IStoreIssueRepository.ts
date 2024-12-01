import { StoreIssue } from "../../entities/store/StoreIssue";

export interface IStoreIssueRepository {

    // Method to create a store issue
    createStoreIssue(issue: StoreIssue): Promise<any>;

    // Method to get a single store issue by its ID
    getStoreIssue(id: number): Promise<any>;

    // Method to get all store issues with pagination
    getStoreIssues(limit: number, offset: number): Promise<any[]>;

    // Method to update a store issue by its ID
    updateStoreIssue(id: number, issue: Partial<StoreIssue>): Promise<any>;
}
