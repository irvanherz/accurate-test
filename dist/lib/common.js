"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("../config/config.json"));
const fs_1 = require("fs");
function updateConfig() {
    (0, fs_1.writeFileSync)('./config/config.json', JSON.stringify(config_json_1.default));
}
exports.default = updateConfig;
