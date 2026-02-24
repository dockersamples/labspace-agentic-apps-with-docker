import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import { mastra } from "./mastra";

const app = express();
const port = process.env.PORT || 3030;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/express/index.html");
});

app.get('/analyze', async (req, res) => {
  const { url } = req.query as { url?: string };
 
  if (!url) {
    return res.status(400).send("Missing 'url' query parameter");
  }

  const agent = mastra.getAgent("websiteAnalyzer");

  try {
    const result = await agent.generate(`Analyze the website at ${url}`);
    return res.json({ analysis: result.text });
  } catch (error) {
    console.error("Error analyzing website:", error);
    return res.status(500).send("Error analyzing website");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});