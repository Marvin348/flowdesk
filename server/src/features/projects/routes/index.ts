import { Router } from "express";
import projectDetailsRoutes from "@/features/projects/routes/projectDetails.routes.js";
import projectBaseRoutes from "@/features/projects/routes/projectBase.routes.js";
import projectMembers from "@/features/projects/routes/projectMembers.routes.js";
import projectAttachments from "@/features/attachments/routes/projectAttachments.routes.js";

const router = Router();

router.use(projectMembers);
router.use(projectAttachments);
router.use(projectDetailsRoutes);
router.use(projectBaseRoutes);

export default router;
