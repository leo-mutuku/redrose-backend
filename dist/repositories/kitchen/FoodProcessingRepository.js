"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodProcessingRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let FoodProcessingRepository = class FoodProcessingRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createFoodProcessing(_a) {
        return __awaiter(this, arguments, void 0, function* ({ food_item, user_id }) {
            try {
                //check  for duplicateentries in fooo_id kitchen_setup_id in the array object should be unique
                const duplicateEntries = food_item.reduce((acc, item) => {
                    const key = `${item.kitchen_setup_id}`;
                    if (!acc[key]) {
                        acc[key] = 1;
                    }
                    else {
                        acc[key]++;
                    }
                    return acc;
                }, {});
                if (Object.values(duplicateEntries).some((count) => count > 1)) {
                    throw new AppError_1.AppError('Duplicate entries found in food_item entries', 400);
                }
                // prepare a list of ingredients base on kitchen setup id
                // store procedure to per the task after passing food_item array as parameter and return the list of ingredients
                // Convert food_item array to JSON
                const foodItemJson = JSON.stringify(food_item);
                // Prepare and execute the SQL query
                console.log(foodItemJson);
                const result = yield this.client.query(` SELECT * FROM get_kitchen_ingredients_by_setup_id(
                $1::JSON
            );`, [foodItemJson]);
                // Process the result convert to javascript 
                const ingredients = result.rows;
                console.log(ingredients);
                // Group by store_item_id and sum the quantities
                const groupedIngredients = Object.values(ingredients.reduce((acc, item) => {
                    // Convert the quantity to a number for calculation
                    const quantity = parseFloat(item.quantity);
                    // Check if the store_item_id already exists in the accumulator
                    if (!acc[item.store_item_id]) {
                        // If not, initialize it with the current item and store the ingredients_id
                        acc[item.store_item_id] = {
                            store_item_id: item.store_item_id,
                            ingredients_id: item.ingredients_id, // Keep the first ingredients_id encountered
                            quantity: quantity
                        };
                    }
                    else {
                        // If exists, add the quantity to the existing item
                        acc[item.store_item_id].quantity += quantity;
                    }
                    return acc;
                }, {}));
                let store_itemsjson = JSON.stringify(groupedIngredients);
                const result2 = yield this.client.query(` SELECT update_store_item_quantities(
                $1::JSON
            );`, [store_itemsjson]);
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating food processing entry: ' + error, 500);
            }
        });
    }
    getFoodProcessings(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT process_id, process_name, description, 
                TO_CHAR(start_date, 'DD/MM/YYYY') AS start_date, 
                TO_CHAR(end_date, 'DD/MM/YYYY') AS end_date,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM food_processing
                LIMIT $1 OFFSET $2
            `;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching food processing entries: ' + error, 500);
            }
        });
    }
    getFoodProcessing(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT process_id, process_name, description, 
                TO_CHAR(start_date, 'DD/MM/YYYY') AS start_date, 
                TO_CHAR(end_date, 'DD/MM/YYYY') AS end_date,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM food_processing
                WHERE process_id = $1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Food processing entry not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching food processing entry: ' + error, 500);
            }
        });
    }
    updateFoodProcessing(id, foodProcessing) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE food_processing SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(foodProcessing).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE process_id = $${values.length + 1} RETURNING 
                process_id, process_name, description, 
                TO_CHAR(start_date, 'DD/MM/YYYY') AS start_date, 
                TO_CHAR(end_date, 'DD/MM/YYYY') AS end_date,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Food processing entry not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating food processing entry: ' + error, 500);
            }
        });
    }
};
exports.FoodProcessingRepository = FoodProcessingRepository;
exports.FoodProcessingRepository = FoodProcessingRepository = __decorate([
    (0, inversify_1.injectable)()
], FoodProcessingRepository);
