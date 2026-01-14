import express from "express";
import { checkLogin, checkPermission } from "../middleware/jwt";
import * as controller from "../controllers/employee.controller";

let employeeRoute = express.Router();

employeeRoute.use(checkLogin, checkPermission);

employeeRoute.get("/get-state", controller.getStateController);
employeeRoute.post("/change-shift-state", controller.changeShiftStateController);
employeeRoute.post("/get-shifts", controller.getShiftsController);
employeeRoute.post("/save-password", controller.savePasswordController);

export default employeeRoute;