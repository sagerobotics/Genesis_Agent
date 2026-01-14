import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";
import { Agent } from "@openai/agents";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const agent = new Agent({
  name: "Genesis Agent",
  instructions: "An AI agent that helps with various tasks.",
});

export const runGenesis = async (input) => {
  const response = await client.responses.create({
    model: "gpt-5-nano",
    input,
  });

  return response.output_text || "";
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
};

const startUi = async () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const indexPath = path.join(__dirname, "public", "index.html");
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  const server = http.createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/") {
      try {
        const html = await readFile(indexPath, "utf8");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      } catch (error) {
        sendJson(res, 500, { error: "Failed to load UI." });
      }
      return;
    }

    if (req.method === "POST" && req.url === "/api/message") {
      let body = "";
      let isTooLarge = false;
      req.on("data", (chunk) => {
        body += chunk;
        if (body.length > 1_000_000) {
          isTooLarge = true;
          req.destroy();
        }
      });

      req.on("end", async () => {
        if (isTooLarge) {
          sendJson(res, 413, { error: "Request payload too large." });
          return;
        }

        let payload;
        try {
          payload = JSON.parse(body || "{}");
        } catch {
          sendJson(res, 400, { error: "Invalid JSON payload." });
          return;
        }

        const input = typeof payload.input === "string" ? payload.input.trim() : "";
        if (!input) {
          sendJson(res, 400, { error: "Input text is required." });
          return;
        }

        if (!process.env.OPENAI_API_KEY) {
          sendJson(res, 500, { error: "Missing OPENAI_API_KEY." });
          return;
        }

        try {
          const output = await runGenesis(input);
          sendJson(res, 200, { output });
        } catch (error) {
          console.error("Genesis UI error:", error);
          sendJson(res, 500, { error: "Failed to reach the model." });
        }
      });
      return;
    }

    sendJson(res, 404, { error: "Not found." });
  });

  server.listen(port, () => {
    console.log(`Genesis UI listening on http://localhost:${port}`);
  });
};

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  const args = process.argv.slice(2);
  if (args.includes("--ui")) {
    await startUi();
  } else {
    const input = args.join(" ").trim() || "How old is the universe?";
    const output = await runGenesis(input);
    console.log(output);
  }
}
