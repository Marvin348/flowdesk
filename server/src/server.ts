import app from "@/app.js";
import dotenv from "dotenv";
import { connectDb } from "@/shared/config/db.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

const startServer = async () => {
  await connectDb();

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

startServer();
