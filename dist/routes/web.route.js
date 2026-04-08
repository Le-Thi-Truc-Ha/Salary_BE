"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_route_1 = __importDefault(require("./app.route"));
const admin_route_1 = __importDefault(require("./admin.route"));
const employee_route_1 = __importDefault(require("./employee.route"));
let initWebRoute = (app) => {
    app.use("/", app_route_1.default);
    app.use("/admin", admin_route_1.default);
    app.use("/employee", employee_route_1.default);
};
exports.default = initWebRoute;
