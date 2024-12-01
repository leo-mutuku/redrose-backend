import { StoreItem } from "../../entities/store/StoreItem";

export interface IStoreItemRepository {

    // Method to create a store item
    createStoreItem(item: StoreItem): Promise<StoreItem>;

    // Method to get a single store item by its ID
    getStoreItem(id: number): Promise<StoreItem>;

    // Method to get all store items with pagination
    getStoreItems(limit: number, offset: number): Promise<StoreItem[]>;

    // Method to update a store item by its ID
    updateStoreItem(id: number, item: Partial<StoreItem>): Promise<StoreItem>;
}
