import "dotenv/config";

import app from "@/app.js";
import { connectDb } from "@/shared/config/db.js";


const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
  await connectDb();

  app.listen(PORT, HOST, () => {
    console.log(`server running on port ${PORT}`);
  });
};

startServer();
