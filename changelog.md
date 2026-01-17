# Changelog

## Unreleased
- Wire `Genesis.mjs` to the Agents SDK tool API using `tool(...)` and `run(...)` so the retriever can be invoked.
- Define the `info_retriever` tool schema and attach it to the agent.
- Remove the direct Responses API call and unused OpenAI client setup.
- Make `info_retriever` tool parameters required to satisfy the SDK schema validation.
- Note: `serviceaccount.json` lives on the "Principal_Office" computer and is set via an environment variable.




Developer notes:
- I had to set the credintials JSON file as an enviornmental variable to ensure my firebase api worked and that info_retriever.mjs successfully pulled the information
