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
exports.KitchenStationRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let KitchenStationRepository = class KitchenStationRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createKitchenStation(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, lead_staff_id }) {
            try {
                const query = `
                INSERT INTO station (name, lead_staff_id)
                VALUES ($1, $2)
                RETURNING station_id, name, lead_staff_id,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
                const values = [name, lead_staff_id];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating kitchen station: ' + error, 500);
            }
        });
    }
    getKitchenStations(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
               SELECT 
        s.station_id, 
        s.name, 
        s.lead_staff_id, 
        e.first_name || ' ' || e.last_name AS lead_staff,  
        TO_CHAR(s.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
    FROM 
        station AS s 
    INNER JOIN 
        staff AS e 
    ON 
        e.staff_id = s.lead_staff_id
                LIMIT $1 OFFSET $2
            `;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching kitchen stations: ' + error, 500);
            }
        });
    }
    getKitchenStation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT 
        s.station_id, 
        s.name, 
        s.lead_staff_id, 
        e.first_name || ' ' || e.last_name AS lead_staff,  
        TO_CHAR(s.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
    FROM 
        station AS s 
    INNER JOIN 
        staff AS e 
    ON 
        e.staff_id = s.lead_staff_id
    WHERE 
        s.station_id = $1;
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Kitchen station not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching kitchen station: ' + error, 500);
            }
        });
    }
    updateKitchenStation(id, kitchenStation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE station SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(kitchenStation).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE station_id = $${values.length + 1} RETURNING 
                station_id, name, lead_staff_id,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Kitchen station not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating kitchen station: ' + error, 500);
            }
        });
    }
};
exports.KitchenStationRepository = KitchenStationRepository;
exports.KitchenStationRepository = KitchenStationRepository = __decorate([
    (0, inversify_1.injectable)()
], KitchenStationRepository);
