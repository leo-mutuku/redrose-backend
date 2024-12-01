export interface IItemRegisterInteractor {
    createRegister(input: any);
    getRegister(id: number);
    updateRegister(id: number, input: any);
    getRegisters(limit: number, offset: number);
}
