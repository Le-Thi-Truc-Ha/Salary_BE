import express from "express";
import { checkLogin, checkPermission } from "../middleware/jwt";
import * as controller from "../controllers/admin.controller";

let adminRoute = express.Router();

adminRoute.use(checkLogin, checkPermission);

adminRoute.get("/awake-backend", controller.awakeBackendController);
adminRoute.post("/get-shifts", controller.getShiftsController);
adminRoute.post("/save-password", controller.savePasswordController);
adminRoute.get("/get-employee", controller.getEmployeeController);
adminRoute.post("/create-employee", controller.createEmployeeController);
adminRoute.post("/reset-password", controller.resetPasswordController);
adminRoute.post("/delete-employee", controller.deleteEmployeeController);

export default adminRoute;