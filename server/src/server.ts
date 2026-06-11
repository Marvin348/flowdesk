import "dotenv/config";

import app from "@/app.js";
import { connectDb } from "@/shared/config/db.js";


const PORT = Number(process.env.PORT) || 3001;

const startServer = async () => {
  await connectDb();

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

startServer();
