import { Router } from "express";
import projectDetailsRoutes from "@/routes/projects/projectDetails.routes.js";
import projectBaseRoutes from "@/routes/projects/projectBase.routes.js";
import projectMembers from "@/routes/projects/projectMembers.routes.js";
import projectOptions from "@/routes/projects/projectOptions.routes.js";

const router = Router();

router.use(projectDetailsRoutes);
router.use(projectBaseRoutes);
router.use(projectMembers);
router.use(projectOptions);

export default router;
