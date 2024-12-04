export interface IPurchaseOrderRepository {
    /**
     * Creates a new purchase order record.
     * @param input - The data for the purchase order (e.g., supplier, items, total cost).
     * @returns A promise resolving to the created purchase order record.
     */
    createPurchaseOrder(input: any): Promise<any>;

    /**
     * Retrieves a specific purchase order by its unique identifier.
     * @param id - The unique ID of the purchase order.
     * @returns A promise resolving to the requested purchase order record or null if not found.
     */
    getPurchaseOrder(id: number): Promise<any>;

    /**
     * Updates details of a specific purchase order.
     * @param id - The unique ID of the purchase order to update.
     * @param input - The updated data for the purchase order.
     * @returns A promise resolving to the updated purchase order record.
     */
    updatePurchaseOrder(id: number, input: any): Promise<any>;

    /**
     * Approves a specific purchase order.
     * @param id - The unique ID of the purchase order to approve.
     * @param input - Any additional data required for approval (e.g., approver's remarks).
     * @returns A promise resolving to the approved purchase order record.
     */
    approvePurchaseOrder(id: number, input: any): Promise<any>;

    /**
     * Retrieves a paginated list of purchase orders.
     * @param limit - The maximum number of purchase orders to fetch.
     * @param offset - The starting index for fetching purchase orders.
     * @returns A promise resolving to a collection of purchase order records.
     */
    getPurchaseOrders(limit: number, offset: number): Promise<any>;

    /**
     * Deletes a specific purchase order record.
     * @param id - The unique ID of the purchase order to delete.
     * @returns A promise resolving to a confirmation or an error if the deletion fails.
     */
    deletePurchaseOrder(id: number): Promise<any>;
}
