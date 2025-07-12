import express from "express";
import { CreateExpense,deleteExpense,getAllExpense,getExpenseById} from "../controllers/expense-constoller.js";
import isExisted from "../middlewares/isExisted.js";
const router = express.Router();

router.get("/", isExisted, getAllExpense);
router.get("/:id", isExisted, getExpenseById);
router.post("/", isExisted, CreateExpense);
router.delete("/:id", isExisted, deleteExpense);

export default router;