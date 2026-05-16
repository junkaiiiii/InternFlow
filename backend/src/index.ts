import "dotenv/config";

import cors from "cors";
import express, { type Request, type Response } from "express";
import prisma from "./libs/prisma.js";
import router from "./routes/index.js"

const app = express();
const PORT = process.env.BACKEND_PORT ?? 5132;

app.use(cors());
app.use(express.json());

app.use('/api', router)

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "InternFlow backend is running",
  });
});

app.get("/prisma", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      users,
    });
  } catch (error){
    console.error("Prisma Error:",error)
    res.status(500).json({ message: "Internal server error" });
  }
  
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "hellooo",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;
