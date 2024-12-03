export interface IFoodProcessingInteractor {
    createFoodProcessing(input: any);
    getFoodProcessing(id: number);
    updateFoodProcessing(id: number, input: any);
    getFoodProcessings(limit: number, offset: number);
}
