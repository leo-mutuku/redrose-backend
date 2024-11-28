export interface IFundTransferInteractor {
    /**
     * Initiates a fund transfer between accounts.
     * @param transferData - The data required to initiate the transfer, including source and destination accounts and the transfer amount.
     * @returns A promise that resolves to the details of the initiated transfer.
     */
    initiateFundTransfer(transferData: any);

    /**
     * Retrieves a fund transfer by its ID.
     * @param transferId - The unique identifier of the fund transfer.
     * @returns A promise that resolves to the fund transfer details.
     */
    getFundTransferById(transfer_id: number);

    /**
     * Retrieves all fund transfers.
     * @returns A promise that resolves to a list of all fund transfers.
     */
    getAllFundTransfers(limit: number, offset: number);

    /**
     * Updates an existing fund transfer.
     * @param transferId - The unique identifier of the fund transfer.
     * @param updateData - The data to update the fund transfer with.
     * @returns A promise that resolves to the updated fund transfer details.
     */
    updateFundTransfer(transfer_id: number, updateData: any);

    /**
     * Deletes a fund transfer by its ID.
     * @param transferId - The unique identifier of the fund transfer.
     * @returns A promise that resolves when the fund transfer is deleted.
     */
    deleteFundTransfer(transfer_id: number);
}
