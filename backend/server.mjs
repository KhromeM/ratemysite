import express from "express";
import bodyParser from "body-parser";
import { analyzeWebsite } from "./script.mjs";
import { getAllScores } from "./utils.mjs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/analyze", async (req, res) => {
	try {
		const { url } = req.body;
		if (!url) return res.status(400).json({ error: "URL required" });

		const result = await analyzeWebsite(url);
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get("/scores", async (req, res) => {
	try {
		const scores = await getAllScores();
		res.json(scores);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
