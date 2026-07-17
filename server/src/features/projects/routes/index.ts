import { Router } from "express";
import projectDetailsRoutes from "@/features/projects/routes/projectDetails.routes";
import projectBaseRoutes from "@/features/projects/routes/projectBase.routes";
import projectMembers from "@/features/projects/routes/projectMembers.routes";
import projectAttachments from "@/features/attachments/routes/projectAttachments.routes";

const router = Router();

router.use(projectMembers);
router.use(projectAttachments);
router.use(projectDetailsRoutes);
router.use(projectBaseRoutes);

export default router;
