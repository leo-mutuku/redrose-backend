export interface IStoreTransferRepository {
    createStoreTransfer(input: any): Promise<any>;
    getStoreTransfer(id: number): Promise<any>;
    updateStoreTransfer(id: number, input: any): Promise<any>;
    getStoreTransfers(limit: number, offset: number): Promise<any>;
}
