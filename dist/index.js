"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("./configs/cors"));
const web_route_1 = __importDefault(require("./routes/web.route"));
dotenv_1.default.config();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = (0, express_1.default)();
(0, cors_1.default)(app);
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
(0, web_route_1.default)(app);
app.listen(port, () => {
    console.log("Backend is running on the port: " + port);
});
