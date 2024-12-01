export interface IItemCategoryRepository {
    createItemCategory(input: any): Promise<any>;
    getItemCategory(id: number): Promise<any>;
    updateItemCategory(id: number, input: any): Promise<any>;
    getItemCategories(limit: number, offset: number): Promise<any>;
}
