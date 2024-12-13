export interface IKitchenSetupRepository {
    createKitchenSetup(input: any): Promise<any>;
    getKitchenSetup(id: number): Promise<any>;
    updateKitchenSetup(id: number, input: any): Promise<any>;
    getKitchenSetups(limit: number, offset: number): Promise<any>;
    deleteKitchenSetup(id: number): Promise<any>;
}
