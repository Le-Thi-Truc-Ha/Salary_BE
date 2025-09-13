import express from "express";
import { checkLogin, checkPermission } from "../middleware/jwt";

let employeeRoute = express.Router();

employeeRoute.use(checkLogin, checkPermission);

export default employeeRoute;