export interface IMpesaTillRepository {
    /**
     * Creates a new Mpesa Till transaction record.
     * @param mpesaTillData - The data for the Mpesa Till transaction to be created.
     * @returns A promise that resolves with the created Mpesa Till transaction record.
     */
    createMpesaTill(input: any): Promise<any>;

    /**
     * Retrieves an Mpesa Till transaction record by its ID.
     * @param mpesaTillTransactionId - The ID of the Mpesa Till transaction to find.
     * @returns A promise that resolves with the Mpesa Till transaction record or null if not found.
     */
    getMpesaTillById(mpesa_till_transaction_id: number): Promise<any | null>;

    /**
     * Retrieves all Mpesa Till transaction records.
     * @param limit - The maximum number of records to retrieve.
     * @param offset - The starting point for retrieving records.
     * @returns A promise that resolves with an array of Mpesa Till transaction records.
     */
    getAllMpesaTill(limit: number, offset: number): Promise<any[]>;

    /**
     * Updates an existing Mpesa Till transaction record by its ID.
     * @param mpesaTillTransactionId - The ID of the Mpesa Till transaction to update.
     * @param updateData - The data to update the Mpesa Till transaction record with.
     * @returns A promise that resolves with the updated Mpesa Till transaction record.
     */
    updateMpesaTill(mpesa_till_transaction_id: number, updateData: any): Promise<any>;

    /**
     * Deletes an Mpesa Till transaction record by its ID.
     * @param mpesaTillTransactionId - The ID of the Mpesa Till transaction to delete.
     * @returns A promise that resolves when the Mpesa Till transaction record is deleted.
     */
    deleteMpesaTill(mpesa_till_transaction_id: number): Promise<void>;
}
