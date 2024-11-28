export interface IBankRepository {
    /**
     * Creates a new bank record.
     * @param bankData - The data for the bank to be created.
     * @returns A promise that resolves with the created bank record.
     */
    createBank(input: any): Promise<any>;

    /**
     * Finds a bank record by its ID.
     * @param bankId - The ID of the bank to find.
     * @returns A promise that resolves with the bank record or null if not found.
     */
    getBankById(bank_id: number): Promise<any | null>;

    /**
     * Retrieves all bank records.
     * @param limit - The maximum number of records to retrieve.
     * @param offset - The starting point for retrieving records.
     * @returns A promise that resolves with an array of bank records.
     */
    getAllBanks(limit: number, offset: number): Promise<any[]>;

    /**
     * Updates an existing bank record by its ID.
     * @param bankId - The ID of the bank to update.
     * @param updateData - The data to update the bank record with.
     * @returns A promise that resolves with the updated bank record.
     */
    updateBank(bank_id: number, updateData: any): Promise<any>;

    /**
     * Deletes a bank record by its ID.
     * @param bankId - The ID of the bank to delete.
     * @returns A promise that resolves when the bank record is deleted.
     */
    deleteBank(bank_id: number): Promise<void>;
}
