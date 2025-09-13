import { Application } from "express";
import appRoute from "./app.route";
import adminRoute from "./admin.route";
import employeeRoute from "./employee.route";

let initWebRoute = (app: Application): void => {
    app.use("/", appRoute);
    app.use("/admin", adminRoute);
    app.use("/employee", employeeRoute);
}

export default initWebRoute;