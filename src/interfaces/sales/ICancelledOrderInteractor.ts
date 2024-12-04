export interface ICancelledOrderInteractor {
    /**
     * Creates a new cancelled order record.
     * @param input - The data for the cancelled order (e.g., order ID, reason for cancellation).
     * @returns A promise resolving to the created cancelled order record.
     */
    createCancelledOrder(input: any);

    /**
     * Retrieves a specific cancelled order by its unique identifier.
     * @param id - The unique ID of the cancelled order.
     * @returns A promise resolving to the requested cancelled order record or null if not found.
     */
    getCancelledOrder(id: number);

    /**
     * Updates details of a specific cancelled order.
     * @param id - The unique ID of the cancelled order to update.
     * @param input - The updated data for the cancelled order.
     * @returns A promise resolving to the updated cancelled order record.
     */
    updateCancelledOrder(id: number, input: any);

    /**
     * Retrieves a paginated list of cancelled orders.
     * @param limit - The maximum number of cancelled orders to fetch.
     * @param offset - The starting index for fetching cancelled orders.
     * @returns A promise resolving to a collection of cancelled order records.
     */
    getCancelledOrders(limit: number, offset: number);

    /**
     * Deletes a specific cancelled order record.
     * @param id - The unique ID of the cancelled order to delete.
     * @returns A promise resolving to a confirmation or an error if the deletion fails.
     */
    deleteCancelledOrder(id: number);
}
