import express from "express";
import { getAllCustomers,createCustomer,deleteCustomer,getCustomerById,updateCustomer, ToggleCustomerPayed } from "../controllers/customer-contoller.js";

const router = express.Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.patch("/payed/:id", ToggleCustomerPayed);

export default router;
