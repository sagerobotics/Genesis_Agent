import path from "node:path";
import readline from "readline";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { info_retriever } from "./Info_retriever.mjs";
import { Agent, run, tool } from "@openai/agents";
const defaultPrompt = "What is today's date?";

const infoRetrieverTool = tool({
  name: "info_retriever",
  description: "Retrieves relevant facts from the McClarty family facts database.",
  parameters: z.object({
    tag: z.string().nullable(),
    limit: z.number().int().min(1).max(20),
  }),
  execute: async (input) => info_retriever(input ?? {}),
});

export const agent = new Agent({
  name: "Genesis Agent",
  instructions: "A very friendly AI agent that helps with various tasks.",
  tools: [infoRetrieverTool],
});

export const runGenesis = async (input) => {
  const result = await run(agent, input);
  return result.finalOutput || "";
};

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  const args = process.argv.slice(2);
  const argInput = args.join(" ").trim();

  if (argInput) {
    const output = await runGenesis(argInput);
    console.log(output);
  } else {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askQuestion = (prompt) =>
      new Promise((resolve) => {
        rl.question(prompt, (answer) => resolve(answer));
      });

    console.log("Genesis Agent ready. Type 'exit' to quit.");
    while (true) {
      const input = (await askQuestion("You> ")).trim();
      if (!input) {
        continue;
      }
      if (input.toLowerCase() === "exit") {
        break;
      }

      const output = await runGenesis(input || defaultPrompt);
      console.log(`Genesis> ${output}`);
    }

    rl.close();
  }
}
