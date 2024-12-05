export interface ISalesOrderClearingInteractor {
    /**
     * Clears a specific sales order.
     * @param orderId - The ID of the sales order to be cleared.
     * @param input - The data required to clear the order (e.g., payment details, clearance date).
     * @returns A promise resolving to the cleared sales order record.
     */
    createSalesOrderClearing(input: any);

    /**
     * Retrieves a specific sales order clearing record by its unique identifier.
     * @param clearingId - The unique ID of the clearing record.
     * @returns A promise resolving to the clearing record or null if not found.
     */
    getSalesOrderClearing(clearingId: number): Promise<any>;

    /**
     * Retrieves a list of sales orders that are pending clearing.
     * @param limit - The maximum number of orders to fetch.
     * @param offset - The starting index for fetching orders.
     * @returns A promise resolving to a collection of sales orders pending clearance.
     */
    // getPendingSalesOrders(limit: number, offset: number);

    /**
     * Updates the details of a specific sales order clearing.
     * @param clearingId - The unique ID of the clearing record to update.
     * @param input - The updated data for the clearing record.
     * @returns A promise resolving to the updated clearing record.
     */
    updateSalesOrderClearing(clearingId: number, input: any);

    /**
     * Retrieves a list of sales orders that have been cleared.
     * @param limit - The maximum number of orders to fetch.
     * @param offset - The starting index for fetching orders.
     * @returns A promise resolving to a collection of cleared sales orders.
     */
    getSalesOrderClearings(limit: number, offset: number);
}
