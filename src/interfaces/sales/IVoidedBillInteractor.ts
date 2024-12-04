export interface IVoidedBillInteractor {
    /**
     * Creates a new voided bill record.
     * @param input - The data for the voided bill.
     * @returns A promise resolving to the created voided bill.
     */
    createVoidedBill(input: any);

    /**
     * Retrieves a specific voided bill by its unique identifier.
     * @param id - The unique ID of the voided bill.
     * @returns A promise resolving to the requested voided bill or null if not found.
     */
    getVoidedBill(id: number);

    /**
     * Updates details of a specific voided bill.
     * @param id - The unique ID of the voided bill to update.
     * @param input - The updated data for the voided bill.
     * @returns A promise resolving to the updated voided bill or an appropriate response.
     */
    updateVoidedBill(id: number, input: any);

    /**
     * Retrieves a paginated list of voided bills.
     * @param limit - The maximum number of voided bills to fetch.
     * @param offset - The starting index for fetching voided bills.
     * @returns A promise resolving to a collection of voided bills.
     */
    getVoidedBills(limit: number, offset: number);
}
