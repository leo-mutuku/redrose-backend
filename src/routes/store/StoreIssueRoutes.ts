import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IStoreIssueRepository } from "../../interfaces/store/IStoreIssueRepository";
import { IStoreIssueInteractor } from "../../interfaces/store/IStoreIssueInteractor";
import { StoreIssueInteractor } from "../../interactors/store/StoreIssueInteractor";
import { StoreIssueController } from "../../controllers/store/StoreIssueController";
import { StoreIssueRepository } from "../../repositories/store/StoreIssueRepository";

// Initialize Inversify container
const container = new Container();
// Bind Issue-related interfaces to their implementations
container.bind<IStoreIssueRepository>(INTERFACE_TYPE.StoreIssueRepository).to(StoreIssueRepository);
container.bind<IStoreIssueInteractor>(INTERFACE_TYPE.StoreIssueInteractor).to(StoreIssueInteractor);
container.bind(INTERFACE_TYPE.StoreIssueController).to(StoreIssueController);
// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<StoreIssueController>(INTERFACE_TYPE.StoreIssueController);

// Define the routes and bind controller methods
router.post("/createissue", controller.onCreateStoreIssue.bind(controller));
router.get("/getissue/:id", controller.onGetStoreIssue.bind(controller));
router.get("/getissues", controller.onGetStoreIssues.bind(controller)); // Example for listing issues with pagination
router.patch("/updateissue/:id", controller.onUpdateStoreIssue.bind(controller));

// Export the configured router
export default router;
