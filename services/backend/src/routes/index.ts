import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import ordersRouter from "./orders";
import menuRouter from "./menu";
import customersRouter from "./customers";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(ordersRouter);
router.use(menuRouter);
router.use(customersRouter);
router.use(settingsRouter);

export default router;
