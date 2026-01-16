import express from "express";
import * as controller from "../controllers/app.controller";

let appRoute = express.Router();

appRoute.get("/awake-backend", controller.awakeBackendController);
appRoute.get("/reload-page", controller.reloadPageController)
appRoute.post("/login", controller.loginController);
appRoute.get("/logout", controller.logoutController);

export default appRoute;