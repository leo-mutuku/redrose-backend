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
exports.SalesOrderRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let SalesOrderRepository = class SalesOrderRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    // Create a new sales order
    createSalesOrder(_a) {
        return __awaiter(this, arguments, void 0, function* ({ order_items, }) {
            var _b;
            try {
                // Prepare store item JSON
                const qry = `SELECT * FROM kitchen_setup WHERE menu_item_id = $1`;
                const v1 = [order_items[0].menu_item_id];
                const r1 = yield this.client.query(qry, v1);
                console.log(r1.rows[0]);
                const menu_json = JSON.stringify(order_items);
                // Get array of setup IDs
                const setupids = [];
                if (order_items) {
                    for (const item of order_items) {
                        setupids.push(item.menu_item_id);
                    }
                }
                console.log(setupids);
                const setupid = (_b = r1.rows[0]) === null || _b === void 0 ? void 0 : _b.kitchen_setup_id;
                if (!setupid) {
                    throw new AppError_1.AppError('Kitchen setup ID not found.', 404);
                }
                let stores = [];
                for (let item of setupids) {
                    console.log(item, "item");
                    const qry2 = `SELECT * FROM kitchen_setup WHERE menu_item_id = $1`;
                    const v2 = [item];
                    const r2 = yield this.client.query(qry2, v2);
                    let ingredients_id = parseInt(r2.rows[0].kitchen_setup_id);
                    console.log(ingredients_id, "ing");
                    // get ingredients seting , pick, store_item, quantity and source_type
                    let qry3 = `select * from kitchen_ingredients where ingredients_id = $1`;
                    let v3 = [ingredients_id];
                    let r3 = yield this.client.query(qry3, v3);
                    if (!r3.rows.length) {
                        throw new AppError_1.AppError("Error in ingredients setup, one of the item in the menu is not set well", 500);
                    }
                    for (let item of r3.rows) {
                        console.log(item, "item");
                        stores.push({
                            quantity: parseFloat(item.quantity),
                            store_item_id: item.store_item_id,
                            source_type: item.source_type
                        });
                    }
                    console.log(stores, "stores");
                }
                if (!stores.length) {
                    throw new AppError_1.AppError("Store item in one of tour chosen meal is not setup properly", 500);
                }
                ;
                const updatedData = stores.map((item) => (Object.assign(Object.assign({}, item), { quantity: (item.quantity * order_items[0].quantity).toFixed(4) })));
                const store_json = JSON.stringify(updatedData);
                // Call the sales order processing function
                const result = yield this.client.query(`SELECT * FROM sales_order_processing($1::JSON, $2::JSON);`, [menu_json, store_json]);
                // Build and return the result
                const salesOrder = {
                    order_items,
                    // Include additional properties if necessary
                };
                return salesOrder;
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating sales order: ' + error, 500);
            }
        });
    }
    // Get a list of sales orders with pagination
    getSalesOrders(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT sales_order_id, customer_id, order_date, total_amount, status, created_by, created_at
                FROM sales_order
                LIMIT $1 OFFSET $2
            `;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching sales orders: ' + error, 500);
            }
        });
    }
    // Get a single sales order by ID
    getSalesOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT sales_order_id, customer_id, order_date, total_amount, status, created_by, created_at
                FROM sales_order
                WHERE sales_order_id = $1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Sales order not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching sales order: ' + error, 500);
            }
        });
    }
    // Update an existing sales order
    updateSalesOrder(id, salesOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE sales_order SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(salesOrder).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE sales_order_id = $${values.length + 1} RETURNING 
                sales_order_id, customer_id, order_date, total_amount, status, created_by, created_at`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Sales order not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating sales order: ' + error, 500);
            }
        });
    }
    // Delete a sales order by ID
    deleteSalesOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM sales_order
                WHERE sales_order_id = $1
                RETURNING sales_order_id, customer_id, order_date, total_amount, status, created_by, created_at
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Sales order not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error deleting sales order: ' + error, 500);
            }
        });
    }
};
exports.SalesOrderRepository = SalesOrderRepository;
exports.SalesOrderRepository = SalesOrderRepository = __decorate([
    (0, inversify_1.injectable)()
], SalesOrderRepository);
