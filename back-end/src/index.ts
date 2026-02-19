import express, { Request, Response } from "express";
import 'dotenv/config'
import projectsRouter from "./routes/projects";
import materialsRouter from "./routes/materials";
import toolsRouter from "./routes/tools";

console.log("ENV CHECK:", process.env.SUPABASE_URL);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Hello World from Backend!" });
});

app.use("/api/projects", projectsRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/tools", toolsRouter);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
