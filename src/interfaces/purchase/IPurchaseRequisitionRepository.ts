export interface IPurchaseRequisitionRepository {
    /**
     * Creates a new purchase requisition record.
     * @param input - The data for the purchase requisition (e.g., requested items, department, and purpose).
     * @returns A promise resolving to the created purchase requisition record.
     */
    createPurchaseRequisition(input: any): Promise<any>;

    /**
     * Retrieves a specific purchase requisition by its unique identifier.
     * @param id - The unique ID of the purchase requisition.
     * @returns A promise resolving to the requested purchase requisition record or null if not found.
     */
    getPurchaseRequisition(id: number): Promise<any>;

    /**
     * Updates details of a specific purchase requisition.
     * @param id - The unique ID of the purchase requisition to update.
     * @param input - The updated data for the purchase requisition.
     * @returns A promise resolving to the updated purchase requisition record.
     */
    updatePurchaseRequisition(id: number, input: any): Promise<any>;

    /**
     * Approves a specific purchase requisition.
     * @param id - The unique ID of the purchase requisition to approve.
     * @param input - Any additional data required for approval (e.g., approver's remarks).
     * @returns A promise resolving to the approved purchase requisition record.
     */
    //sapprovePurchaseRequisition(id: number, input: any): Promise<any>;

    /**
     * Retrieves a paginated list of purchase requisitions.
     * @param limit - The maximum number of requisitions to fetch.
     * @param offset - The starting index for fetching requisitions.
     * @returns A promise resolving to a collection of purchase requisition records.
     */
    getPurchaseRequisitions(limit: number, offset: number): Promise<any>;

    /**
     * Deletes a specific purchase requisition record.
     * @param id - The unique ID of the purchase requisition to delete.
     * @returns A promise resolving to a confirmation or an error if the deletion fails.
     */
    // deletePurchaseRequisition(id: number): Promise<any>;
}
