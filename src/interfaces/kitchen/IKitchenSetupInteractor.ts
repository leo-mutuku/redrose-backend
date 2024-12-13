export interface IKitchenSetupInteractor {
    createKitchenSetup(input: any);
    getKitchenSetup(id: number);
    updateKitchenSetup(id: number, input: any);
    getKitchenSetups(limit: number, offset: number);
    deleteKitchenSetup(id: number);
}
