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
exports.StoreIssueRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let StoreIssueRepository = class StoreIssueRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    // Create a new store issue
    createStoreIssue(_a) {
        return __awaiter(this, arguments, void 0, function* ({ issue_date, description, issued_by, created_by, isssue_list, }) {
            var _b;
            try {
                // Check if issue list is not empty
                if (!isssue_list || isssue_list.length === 0) {
                    throw new AppError_1.AppError("Issue list must not be empty", 400);
                }
                // Insert into store_issue_header
                const query = `
                INSERT INTO store_issue_header (issue_date, description, issued_by, created_by)
                VALUES ($1, $2, $3, $4)
                RETURNING store_issue_header_id, issue_date, description, issued_by, created_by;
            `;
                const values = [issue_date, description, issued_by, created_by];
                const result = yield this.client.query(query, values);
                const header_id = result.rows[0].store_issue_header_id;
                // Process each item in the issue list
                for (const item of isssue_list) {
                    // Step 1: Fetch the current quantity for `store_item_id`
                    const fetchQuantityQuery = `
                    SELECT quantity 
                    FROM store_item 
                    WHERE store_item_id = $1 
                    FOR UPDATE;
                `;
                    const fetchResult = yield this.client.query(fetchQuantityQuery, [item.store_item_id]);
                    const initialQuantity = (_b = fetchResult.rows[0]) === null || _b === void 0 ? void 0 : _b.quantity;
                    if (initialQuantity === undefined || initialQuantity < item.issue_quantity) {
                        throw new AppError_1.AppError(`Insufficient quantity for store_item_id: ${item.store_item_id}`, 400);
                    }
                    // Step 2: Update the quantity in store_item
                    const updateQuery = `
                    UPDATE store_item 
                    SET quantity = quantity - $1 
                    WHERE store_item_id = $2 
                    RETURNING quantity;
                `;
                    const updateResult = yield this.client.query(updateQuery, [
                        item.issue_quantity,
                        item.store_item_id,
                    ]);
                    const finalQuantity = updateResult.rows[0].quantity;
                    // Step 3: Insert into store_issue_line
                    const lineInsertQuery = `
                    INSERT INTO store_issue_line 
                    (store_issue_header_id, store_item_id, issue_quantity, initial_value, final_value)
                    VALUES ($1, $2, $3, $4, $5);
                `;
                    const lineValues = [
                        header_id,
                        item.store_item_id,
                        item.issue_quantity,
                        initialQuantity,
                        finalQuantity,
                    ];
                    yield this.client.query(lineInsertQuery, lineValues);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating store issue: ' + error, 500);
            }
        });
    }
    // Get all store issues with pagination
    getStoreIssues(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
            SELECT 
            sih.store_issue_header_id,
            sih.created_at, 
            sih.issued_by, 
            sih.created_by,
            us.first_name AS created_by_name,  -- Add first_name from users table
            st.first_name AS issued_by_name,  -- Add first_name from staff table
            json_agg(
                json_build_object(
                    'issue_line_id', sil.store_issue_line_id,
                    'store_item_id', sil.store_item_id,
                    'item_id', si.item_id,
                    'item_name', ir.item_name,
                    'issue_quantity', sil.issue_quantity
                )
            ) AS issue_lines
        FROM 
            store_issue_header sih
        INNER JOIN 
            users us
            ON sih.created_by = us.user_id  -- Join on created_by and user_id
        INNER JOIN 
            staff st
            ON sih.issued_by = st.staff_id  -- Join on issued_by and staff_id
        LEFT JOIN 
            store_issue_line sil 
            ON sih.store_issue_header_id = sil.store_issue_header_id
        LEFT JOIN 
            store_item si
            ON sil.store_item_id = si.store_item_id
        LEFT JOIN 
            item_register ir
            ON si.item_id = ir.item_id
        GROUP BY
            sih.store_issue_header_id, 
            us.first_name,
            st.first_name
        ORDER BY
            sih.created_at DESC
        LIMIT $1 OFFSET $2;  -- Add LIMIT and OFFSET with placeholders
        
            `;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching store issues: ' + error, 500);
            }
        });
    }
    // Get a specific store issue by ID
    getStoreIssue(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
SELECT 
    sih.store_issue_header_id,
    sih.created_at, 
    sih.issued_by, 
    sih.created_by,
    us.first_name AS created_by_name,  -- Add first_name from users table
    st.first_name AS issued_by_name,  -- Add first_name from staff table
    json_agg(
        json_build_object(
            'issue_line_id', sil.store_issue_line_id,
            'store_item_id', sil.store_item_id,
            'item_id', si.item_id,
            'item_name', ir.item_name,
            'issue_quantity', sil.issue_quantity
        )
    ) AS issue_lines
FROM 
    store_issue_header sih
INNER JOIN 
    users us
    ON sih.created_by = us.user_id  -- Join on created_by and user_id
INNER JOIN 
    staff st
    ON sih.issued_by = st.staff_id  -- Join on issued_by and staff_id
LEFT JOIN 
    store_issue_line sil 
    ON sih.store_issue_header_id = sil.store_issue_header_id
LEFT JOIN 
    store_item si
    ON sil.store_item_id = si.store_item_id
LEFT JOIN 
    item_register ir
    ON si.item_id = ir.item_id
    WHERE sih.store_issue_header_id = $1
GROUP BY
    sih.store_issue_header_id, 
    us.first_name,
    st.first_name
ORDER BY
    sih.created_at DESC;  -- Add ORDER BY clause to sort by created_at in descending order
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Store issue not found', 404);
                }
                // get isse_list
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching store issue: ' + error, 500);
            }
        });
    }
    // Update a store issue by its ID
    updateStoreIssue(id, issue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE store_issue SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(issue).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE issue_id = $${values.length + 1} 
                RETURNING 
                    issue_id,
                    store_id,
                    item_id,
                    quantity_issued,
                    issued_by,
                    issued_to,
                    TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
                    (SELECT item_name FROM item_register WHERE item_id = store_issue.item_id) AS item_name,
                    (SELECT store_name FROM store_register WHERE store_id = store_issue.store_id) AS store_name;
            `;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Store issue not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating store issue: ' + error, 500);
            }
        });
    }
};
exports.StoreIssueRepository = StoreIssueRepository;
exports.StoreIssueRepository = StoreIssueRepository = __decorate([
    (0, inversify_1.injectable)()
], StoreIssueRepository);
