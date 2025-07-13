import express from "express";
import {
  deleteAdmin,
  getAdmin,
  getAllAdmins,
  login,
  register,
  updateAdmin,
  GetMe,
} from "../controllers/admin-controller.js";
import isExisted from "../middlewares/isExisted.js";

const router = express.Router();

router.get("/me", isExisted, GetMe);
router.get("/", isExisted, getAllAdmins);
router.get("/:id", isExisted, getAdmin);
router.post("/register", register);
router.post("/login", login);
router.put("/:id", isExisted, updateAdmin);
router.delete("/:id", isExisted, deleteAdmin);

export default router;
