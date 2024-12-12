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
exports.MenuCategoryRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let MenuCategoryRepository = class MenuCategoryRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createMenuCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ category_name, description, category_abbr }) {
            try {
                const query = `
                INSERT INTO menu_category (category_name, description, category_abbr)
                VALUES ($1, $2, $3)
                RETURNING menu_category_id, category_name, description,category_abbr,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
                const values = [category_name, description, category_abbr];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating menu category: ' + error, 500);
            }
        });
    }
    getMenuCategories(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT 
    mc.menu_category_id, 
    mc.category_name, 
    mc.description, 
    mc.category_abbr,
    TO_CHAR(mc.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    COALESCE(
        JSON_AGG(
            JSONB_BUILD_OBJECT(
                'menu_item_id', mi.menu_item_id,
                'item_name', ir.item_name,
                'price', mi.price
            )
        ) FILTER (WHERE mi.menu_item_id IS NOT NULL), 
        '[]'
    ) AS menu_items
FROM 
    menu_category mc
LEFT JOIN 
    menu_item mi 
ON 
    mc.menu_category_id = mi.menu_category_id
LEFT JOIN 
    item_register ir
ON 
    mi.menu_register_id = ir.item_id
GROUP BY 
    mc.menu_category_id
            `;
                const result = yield this.client.query(query);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching menu categories: ' + error, 500);
            }
        });
    }
    getMenuCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT 
    mc.menu_category_id, 
    mc.category_name, 
    mc.description, 
    mc.category_abbr,
    TO_CHAR(mc.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    COALESCE(
        JSON_AGG(
            JSONB_BUILD_OBJECT(
                'menu_item_id', mi.menu_item_id,
                'item_name', ir.item_name,
                'price', mi.price
            )
        ) FILTER (WHERE mi.menu_item_id IS NOT NULL), 
        '[]'
    ) AS menu_items
FROM 
    menu_category mc
LEFT JOIN 
    menu_item mi 
ON 
    mc.menu_category_id = mi.menu_category_id
LEFT JOIN 
    item_register ir
ON 
    mi.menu_register_id = ir.item_id
GROUP BY 
    mc.menu_category_id;
                WHERE mc.menu_category_id = $1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Menu category not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching menu category: ' + error, 500);
            }
        });
    }
    updateMenuCategory(id, menuCategory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE menu_category SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(menuCategory).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE menu_category_id = $${values.length + 1} RETURNING 
                menu_category_id, category_name, description,category_abbr,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Menu category not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating menu category: ' + error, 500);
            }
        });
    }
};
exports.MenuCategoryRepository = MenuCategoryRepository;
exports.MenuCategoryRepository = MenuCategoryRepository = __decorate([
    (0, inversify_1.injectable)()
], MenuCategoryRepository);
