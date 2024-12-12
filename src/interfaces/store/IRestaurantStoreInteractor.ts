export interface IRestaurantStoreInteractor {
    createRestaurantStore(input: any);
    getRestaurantStore(id: number);
    updateRestaurantStore(id: number, input: any);
    getRestaurantStores(limit: number, offset: number);
    getRestaurantTracking();
    deleteRestaurantStore(id: number);
}