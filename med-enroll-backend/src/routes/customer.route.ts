import { Router } from "express";
import {
  createCustomer,
  getAllCustomers,
  searchCustomers,
  searchCustomersWithStartWith,
  updateCustomers,
} from "../controllers/customer.controller";

const router = Router();

router.get("/", searchCustomers);
router.get("/all", getAllCustomers);
router.put("/:id", updateCustomers);
router.post("/", createCustomer);
router.post("/filters", searchCustomersWithStartWith);

export default router;
