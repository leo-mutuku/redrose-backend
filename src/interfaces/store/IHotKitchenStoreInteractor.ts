export interface IHotKitchenStoreInteractor {
    createHotKitchenStore(input: any);
    getHotKitchenStore(id: number);
    updateHotKitchenStore(id: number, input: any);
    getHotKitchenStores(limit: number, offset: number);
}
