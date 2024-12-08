export interface IStoreTransferInteractor {
    createStoreTransfer(input: any);
    getStoreTransfer(id: number);
    updateStoreTransfer(id: number, input: any);
    getStoreTransfers(limit: number, offset: number);
}
