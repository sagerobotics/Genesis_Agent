import path from "node:path";
import readline from "readline";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";
import { Agent } from "@openai/agents";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const defaultPrompt = "What is today's date?";

export const agent = new Agent({
  name: "Genesis Agent",
  instructions: "A very friendly AI agent that helps with various tasks.",
});

export const runGenesis = async (input) => {
  const response = await client.responses.create({
    model: "gpt-5-nano",
    input,
  });

  return response.output_text || "";
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
