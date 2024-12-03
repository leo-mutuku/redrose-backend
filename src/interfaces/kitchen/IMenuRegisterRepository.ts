export interface IMenuRegisterRepository {
    createMenuRegister(input: any): Promise<any>;
    getMenuRegister(id: number): Promise<any>;
    updateMenuRegister(id: number, input: any): Promise<any>;
    getMenuRegisters(limit: number, offset: number): Promise<any>;
}
