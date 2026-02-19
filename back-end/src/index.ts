import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import projectsRouter from "./routes/projects";
import materialsRouter from "./routes/materials";
import supabaseClint from "./config/supabase";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Hello World from Backend!" });
});

app.use("/api/projects", projectsRouter);

app.use("/api/materials", materialsRouter);

app.use("/api/materials", materialsRouter);

app.listen(PORT, async () => {
	console.log(`Server running on http://localhost:${PORT}`);

	// Test Supabase connection
	// TODO will be remove later
	try {
		await supabaseClint.from("projects").select("*").limit(1);

		console.log("Supabase Connected");
	} catch (error) {
		console.error("Supabase connection error", error);
	}
});
