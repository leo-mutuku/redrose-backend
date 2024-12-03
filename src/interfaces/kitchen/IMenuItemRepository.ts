export interface IMenuItemRepository {
    createMenuItem(input: any): Promise<any>;
    getMenuItem(id: number): Promise<any>;
    updateMenuItem(id: number, input: any): Promise<any>;
    getMenuItems(limit: number, offset: number): Promise<any>;
}
