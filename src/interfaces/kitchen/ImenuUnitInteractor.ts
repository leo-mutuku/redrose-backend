export interface IMenuUnitInteractor {
    createMenuUnit(input: any);
    getMenuUnit(id: number);
    updateMenuUnit(id: number, input: any);
    getMenuUnits(limit: number, offset: number);
}
