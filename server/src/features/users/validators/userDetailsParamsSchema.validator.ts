import z from "zod";
import mongoose from "mongoose";

export const userDetailsParamsSchema = z.object({
  id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid userId",
  }),
});

export type UserDetailsParams = z.infer<typeof userDetailsParamsSchema>;
