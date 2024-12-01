export interface IStoreRegisterInteractor {
    createRegister(input: any): Promise<any>;
    getRegister(id: number): Promise<any>;
    updateRegister(id: number, input: any): Promise<any>;
    getRegisters(limit: number, offset: number): Promise<any>;
}
