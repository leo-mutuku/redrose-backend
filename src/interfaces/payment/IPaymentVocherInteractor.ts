export interface IPaymentVoucherInteractor {
    /**
     * Creates a new payment voucher record.
     * @param input - The data for the payment voucher (e.g., voucher number, date, amount, and description).
     * @returns A promise resolving to the created payment voucher record.
     */
    createPaymentVoucher(input: any);

    /**
     * Retrieves a specific payment voucher record by its unique identifier.
     * @param id - The unique ID of the payment voucher record.
     * @returns A promise resolving to the requested payment voucher record or null if not found.
     */
    getPaymentVoucher(id: number);

    /**
     * Updates the details of an existing payment voucher record.
     * @param id - The unique ID of the payment voucher record to update.
     * @param input - The updated data for the payment voucher record.
     * @returns A promise resolving to the updated payment voucher record.
     */
    updatePaymentVoucher(id: number, input: any);

    /**
     * Deletes a specific payment voucher record.
     * @param id - The unique ID of the payment voucher record to delete.
     * @returns A promise resolving to a confirmation or an error if the deletion fails.
     */
    deletePaymentVoucher(id: number);

    /**
     * Retrieves a paginated list of payment voucher records.
     * @param limit - The maximum number of payment vouchers to fetch.
     * @param offset - The starting index for fetching payment voucher records.
     * @returns A promise resolving to a collection of payment voucher records.
     */
    getPaymentVouchers(limit: number, offset: number);

    /**
     * Retrieves payment vouchers based on specific criteria (e.g., date range, amount).
     * @param criteria - The search criteria (e.g., date range, status).
     * @returns A promise resolving to a list of payment vouchers matching the criteria.
     */
    searchPaymentVouchers(criteria: any);
}
