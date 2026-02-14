import express, { Request, Response } from "express";
import projectRouter from "./routes/project";
import materialsRouter from "./routes/materials";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Hello World from Backend!" });
});

app.use("/api/projects", projectRouter);

app.use("/api/materials", materialsRouter);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
