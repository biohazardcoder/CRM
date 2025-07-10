import express from "express";
import { getAllCustomers,createCustomer,deleteCustomer,getCustomerById,updateCustomer, ToggleCustomerPayed } from "../controllers/customer-contoller.js";
import isExisted from "../middlewares/isExisted.js";

const router = express.Router();

router.get("/", isExisted, getAllCustomers);
router.get("/:id", isExisted, getCustomerById);
router.post("/", isExisted, createCustomer);
router.put("/:id", isExisted, updateCustomer);
router.delete("/:id", isExisted, deleteCustomer);
router.patch("/payed/:id", isExisted, ToggleCustomerPayed);

export default router;
