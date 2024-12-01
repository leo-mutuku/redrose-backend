export interface IUnitRepository {
    createUnit(input: any): Promise<any>;
    getUnit(id: number): Promise<any>;
    updateUnit(id: number, input: any): Promise<any>;
    getUnits(limit: number, offset: number): Promise<any>;
}
