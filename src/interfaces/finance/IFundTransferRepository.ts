export interface IFundTransferRepository {
    /**
     * Initiates a new fund transfer.
     * @param transferData - The data for the fund transfer to be created.
     * @returns A promise that resolves with the created fund transfer record.
     */
    createFundTransfer(input: any): Promise<any>;

    /**
     * Retrieves a fund transfer record by its ID.
     * @param fundTransferId - The ID of the fund transfer to find.
     * @returns A promise that resolves with the fund transfer record or null if not found.
     */
    getFundTransferById(fund_transfer_id: number): Promise<any | null>;

    /**
     * Retrieves all fund transfer records.
     * @param limit - The maximum number of records to retrieve.
     * @param offset - The starting point for retrieving records.
     * @returns A promise that resolves with an array of fund transfer records.
     */
    getAllFundTransfers(limit: number, offset: number): Promise<any[]>;

    /**
     * Updates an existing fund transfer record by its ID.
     * @param fundTransferId - The ID of the fund transfer to update.
     * @param updateData - The data to update the fund transfer record with.
     * @returns A promise that resolves with the updated fund transfer record.
     */
    updateFundTransfer(fund_transfer_id: number, updateData: any): Promise<any>;

    /**
     * Deletes a fund transfer record by its ID.
     * @param fundTransferId - The ID of the fund transfer to delete.
     * @returns A promise that resolves when the fund transfer record is deleted.
     */
    deleteFundTransfer(fund_transfer_id: number): Promise<void>;
}
