import { Router } from "express";
import userRoutes from "@/features/users/routes/users.js";
import userAvatarRoutes from "@/features/users/routes/userAvatar.routes.js";
import userProjectOptionsRoutes from "@/features/users/routes/userOptions.routes.js";

const router = Router();

router.use(userProjectOptionsRoutes);
router.use(userRoutes);
router.use(userAvatarRoutes);

export default router;
