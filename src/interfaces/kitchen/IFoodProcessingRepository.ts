export interface IFoodProcessingRepository {
    createFoodProcessing(input: any): Promise<any>;
    getFoodProcessing(id: number): Promise<any>;
    updateFoodProcessing(id: number, input: any): Promise<any>;
    getFoodProcessings(limit: number, offset: number): Promise<any>;
}
