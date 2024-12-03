export interface IMenuRegisterInteractor {
    createMenuRegister(input: any);
    getMenuRegister(id: number);
    updateMenuRegister(id: number, input: any);
    getMenuRegisters(limit: number, offset: number);
}
