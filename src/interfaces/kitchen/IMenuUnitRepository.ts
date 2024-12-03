export interface IMenuUnitRepository {
    createMenuUnit(input: any): Promise<any>;
    getMenuUnit(id: number): Promise<any>;
    updateMenuUnit(id: number, input: any): Promise<any>;
    getMenuUnits(limit: number, offset: number): Promise<any>;
}
