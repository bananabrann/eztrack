import express, { Request, Response } from "express";
import projectRouter from "./routes/projects";
import toolRouter from "./routes/tools";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Hello World from Backend!" });
});

// Projects routes
app.use("/api/projects", projectRouter);

// Tools routes
app.use("/api/tools", toolRouter);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
