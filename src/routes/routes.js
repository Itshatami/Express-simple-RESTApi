import { Router } from "express";
import usersRoute from "./users.js";
import productsRoute from "./products.js";

const router = Router();

router.use("/api/users", usersRoute);
router.use("/api/products", productsRoute);

export default router;
