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
exports.StoreItemRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let StoreItemRepository = class StoreItemRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    // Create a new store item
    createStoreItem(_a) {
        return __awaiter(this, arguments, void 0, function* ({ store_id, item_id, quantity, selling_price, buying_price, item_unit, item_category }) {
            try {
                const query = `
                INSERT INTO store_item (store_id, item_id, quantity, selling_price, buying_price, item_unit, item_category)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING 
    store_item_id,
    store_id, 
    item_id, 
    quantity, 
    selling_price, 
    buying_price, 
    item_unit, 
    item_category,
    TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    (SELECT item_name FROM item_register WHERE item_id = store_item.item_id) AS item_name,
    (SELECT category_name from item_category where category_id = store_item.item_category) As category_name,
    (SELECT store_name FROM store_register WHERE store_id = store_item.store_id) AS store_name,
    (SELECT standard_unit_name from item_unit where unit_id = store_item.item_unit) AS unit_name;

    
        

            `;
                const values = [store_id,
                    item_id, quantity, selling_price, buying_price, item_unit, item_category];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating store item: ' + error, 500);
            }
        });
    }
    // Get all store items with pagination
    getStoreItems(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
               SELECT 
    si.store_item_id,
    si.store_id, 
    si.item_id, 
    si.quantity, 
    si.selling_price, 
    si.buying_price, 
    si.item_unit, 
    si.item_category,
    TO_CHAR(si.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    ir.item_name,
    ic.category_name,
    sr.store_name,
    iu.standard_unit_name AS unit_name
FROM store_item si
LEFT JOIN item_register ir ON ir.item_id = si.item_id
LEFT JOIN item_category ic ON ic.category_id = si.item_category
LEFT JOIN store_register sr ON sr.store_id = si.store_id
LEFT JOIN item_unit iu ON iu.unit_id = si.item_unit

            `;
                const result = yield this.client.query(query);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching store items: ' + error, 500);
            }
        });
    }
    // Get a specific store item by ID
    getStoreItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                   SELECT 
    si.store_item_id,
    si.store_id, 
    si.item_id, 
    si.quantity, 
    si.selling_price, 
    si.buying_price, 
    si.item_unit, 
    si.item_category,
    TO_CHAR(si.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    ir.item_name,
    ic.category_name,
    sr.store_name,
    iu.standard_unit_name AS unit_name
FROM store_item si
LEFT JOIN item_register ir ON ir.item_id = si.item_id
LEFT JOIN item_category ic ON ic.category_id = si.item_category
LEFT JOIN store_register sr ON sr.store_id = si.store_id
LEFT JOIN item_unit iu ON iu.unit_id = si.item_unit
WHERE si.store_item_id = $1
LIMIT 1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Store item not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching store item: ' + error, 500);
            }
        });
    }
    getItemtracking() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT 
    t.store_item_id,
    ir.item_name,
    ir.item_id,
    t.current_quantity,
    t.new_quantity,
	t.reason
FROM 
    item_tracking t
LEFT JOIN 
    store_item s ON t.store_item_id = s.store_item_id
LEFT JOIN 
    item_register ir ON s.item_id = ir.item_id

ORDER BY 
    t.item_tracking_id DESC;  
`;
            const result = yield this.client.query(query);
            return result.rows;
        });
    }
    // Update a store item by its ID
    updateStoreItem(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE store_item SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(item).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE item_id = $${values.length + 1} 
                   RETURNING 
    store_item_id,
    store_id, 
    item_id, 
    quantity, 
    selling_price, 
    buying_price, 
    item_unit, 
    item_category,
    TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    (SELECT item_name FROM item_register WHERE item_id = store_item.item_id) AS item_name,
    (SELECT category_name from item_category where category_id = store_item.item_category) As category_name,
    (SELECT store_name FROM store_register WHERE store_id = store_item.store_id) AS store_name,
    (SELECT standard_unit_name from item_unit where unit_id = store_item.item_unit) AS unit_name
                    `;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Store item not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating store item: ' + error, 500);
            }
        });
    }
};
exports.StoreItemRepository = StoreItemRepository;
exports.StoreItemRepository = StoreItemRepository = __decorate([
    (0, inversify_1.injectable)()
], StoreItemRepository);
