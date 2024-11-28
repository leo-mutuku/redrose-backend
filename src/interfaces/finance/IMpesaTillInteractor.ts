export interface IMpesaTillInteractor {
    /**
     * Creates a new Mpesa Till account.
     * @param mpesaTillData - The data for the new Mpesa Till account.
     * @returns A promise that resolves to the newly created Mpesa Till account.
     */
    createMpesaTill(input: any);

    /**
     * Retrieves an Mpesa Till account by its ID.
     * @param mpesaTillId - The unique identifier of the Mpesa Till account.
     * @returns A promise that resolves to the Mpesa Till account details.
     */
    getMpesaTillById(mpesa_till_id: number);

    /**
     * Retrieves all Mpesa Till accounts.
     * @returns A promise that resolves to a list of Mpesa Till accounts.
     */
    getAllMpesaTills(limit: number, offset: number);

    /**
     * Updates an Mpesa Till account by its ID.
     * @param mpesaTillId - The unique identifier of the Mpesa Till account.
     * @param updateData - The data to update the Mpesa Till account with.
     * @returns A promise that resolves to the updated Mpesa Till account.
     */
    updateMpesaTill(mpesa_till_id: number, updateData: any);

    /**
     * Deletes an Mpesa Till account by its ID.
     * @param mpesaTillId - The unique identifier of the Mpesa Till account.
     * @returns A promise that resolves when the Mpesa Till account is deleted.
     */
    deleteMpesaTill(mpesa_till_id: number);
}
