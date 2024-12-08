export interface IHotKitchenStoreRepository {
    createHotKitchenStore(input: any): Promise<any>;
    getHotKitchenStore(id: number): Promise<any>;
    updateHotKitchenStore(id: number, input: any): Promise<any>;
    getHotKitchenStores(limit: number, offset: number): Promise<any>;
}
