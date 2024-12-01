export interface IItemCategoryInteractor {
    createItemCategory(input: any);
    getItemCategory(id: number);
    updateItemCategory(id: number, input: any);
    getItemCategories(limit: number, offset: number);
}
