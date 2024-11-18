import { Router } from "express";
import { UserRepository } from "../../repositories/administration/UserRepository";
import { UserInteractor } from "../../interactors/administration/UserInteractor";
import { UserController } from "../../controllers/administration/UsersController";


const repository = new UserRepository();
const interactor = new UserInteractor(repository);
const controller = new UserController(interactor);

const router = Router();
router.post("/createuser", controller.onCreateUser.bind(controller));
router.get("/getuser/:id", controller.onGetUser.bind(controller));
router.get("/getusers", controller.onGetUsers.bind(controller));
router.put("/:id", controller.onUpdateUser.bind(controller));
export default router;
