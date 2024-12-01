import { StoreIssue } from "../../entities/store/StoreIssue";

export interface IStoreIssueInteractor {

    // Method to create a store issue
    createStoreIssue(issue: StoreIssue);

    // Method to get a single store issue by its ID
    getStoreIssue(id: number);

    // Method to get all store issues with pagination
    getStoreIssues(limit: number, offset: number);

    // Method to update a store issue by its ID
    updateStoreIssue(id: number, issue: Partial<StoreIssue>);
}
