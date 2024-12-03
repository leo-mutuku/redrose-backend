export interface IMenuCategoryInteractor {
    createMenuCategory(input: any);
    getMenuCategory(id: number);
    updateMenuCategory(id: number, input: any);
    getMenuCategories(limit: number, offset: number);
}
