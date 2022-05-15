import express from "express";
import {
  getUsersController,
  createUserController,
  createAdminUserController,
  loginUserController,
  deleteUsersController,
  disableUserController,
  updatePasswordController,
  updateUserController,
} from "../controllers/userController";

const router = express.Router();

router.get("/", (req, res) => getUsersController(req, res));

router.post("/create/admin", (req, res) => createAdminUserController(req, res));

router.post("/create", (req, res) => createUserController(req, res));

router.post("/login", (req, res) => loginUserController(req, res));

router.delete("/delete", (req, res) => deleteUsersController(req, res));

router.put("/disable-user", (req, res) => disableUserController(req, res));

router.put("/change-password", (req, res) =>
  updatePasswordController(req, res)
);

router.put("/update/:id", (req, res) => updateUserController(req, res));

export default router;
