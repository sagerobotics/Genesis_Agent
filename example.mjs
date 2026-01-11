import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // This is optional if the OPENAI_API_KEY environment variable is set

const response = await client.responses.create({
    model: "gpt-5-nano",
    input: "Tell me about Felix McClarty and be concise.",
});

console.log(response.output_text);
