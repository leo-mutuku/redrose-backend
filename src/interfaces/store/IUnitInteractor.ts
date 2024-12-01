export interface IUnitInteractor {
    createUnit(input: any);
    getUnit(id: number);
    updateUnit(id: number, input: any);
    getUnits(limit: number, offset: number);
}
