import { StoreItem } from "../../entities/store/StoreItem";

export interface IStoreItemInteractor {

    // Method to create a store item
    createStoreItem(item: StoreItem);

    // Method to get a single store item by its ID
    getStoreItem(id: number);

    // Method to get all store items with pagination
    getStoreItems(limit: number, offset: number);

    // Method to update a store item by its ID
    updateStoreItem(id: number, item: Partial<StoreItem>);
}
