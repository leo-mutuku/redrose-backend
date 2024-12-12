export interface IRestaurantStoreRepository {
    createRestaurantStore(input: any): Promise<any>;
    getRestaurantStore(id: number): Promise<any>;
    updateRestaurantStore(id: number, input: any): Promise<any>;
    getRestaurantStores(limit: number, offset: number): Promise<any>;
    getRestaurantTracking(): Promise<any>;
    deleteRestaurantStore(id: number): Promise<any>;
}