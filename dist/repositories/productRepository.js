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
exports.ProductRepository = void 0;
const dbConnection_1 = require("../dbConnection");
const inversify_1 = require("inversify");
let ProductRepository = class ProductRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, description, price, stock }) {
            const product = yield this.client.query(`INSERT INTO products (name,description,price,stock) VALUES ($1,$2,$3,$4) RETURNING *`, [name, description, price, stock]);
            return product.rows[0];
        });
    }
    update(id, stock) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.client.query(`UPDATE products SET stock=$1 WHERE id=$2 RETURNING *`, [stock, id]);
            return product.rows[0];
        });
    }
    find(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.client.query(`SELECT * FROM products OFFSET $1 LIMIT $2`, [offset, limit]);
            return products.rows;
        });
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = __decorate([
    (0, inversify_1.injectable)()
], ProductRepository);
