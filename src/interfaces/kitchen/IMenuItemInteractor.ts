export interface IMenuItemInteractor {
    createMenuItem(input: any);
    getMenuItem(id: number);
    updateMenuItem(id: number, input: any);
    getMenuItems(limit: number, offset: number);
    getmenuTracking();
    deleteMenuItem(id: number);
}
