export interface IMenuCategoryRepository {
    createMenuCategory(input: any): Promise<any>;
    getMenuCategory(id: number): Promise<any>;
    updateMenuCategory(id: number, input: any): Promise<any>;
    getMenuCategories(limit: number, offset: number): Promise<any>;
}
