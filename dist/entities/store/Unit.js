"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
class Unit {
    constructor(unit_id, standard_unit_name, standard_unit_value, other_unit_name, other_unit_value) {
        this.unit_id = unit_id;
        this.standard_unit_name = standard_unit_name;
        this.standard_unit_value = standard_unit_value;
        this.other_unit_name = other_unit_name;
        this.other_unit_value = other_unit_value;
    }
}
exports.Unit = Unit;
