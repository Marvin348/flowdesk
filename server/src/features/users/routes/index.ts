import { Router } from "express";
import userRoutes from "@/features/users/routes/users";
import userAvatarRoutes from "@/features/users/routes/userAvatar.routes";
import userProjectOptionsRoutes from "@/features/users/routes/userProjectOptions.routes";

const router = Router();

router.use(userProjectOptionsRoutes);
router.use(userRoutes);
router.use(userAvatarRoutes);

export default router;
