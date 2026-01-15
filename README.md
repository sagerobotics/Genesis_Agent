# Genesis Agent

## Overview
Genesis is the official baseline and template for all agents created by Sage Robotics Company, LLC. It provides a consistent, production-ready foundation for agent configuration and OpenAI Responses API usage. The primary example (`Genesis.mjs`) instantiates an agent and performs a simple model call; `example.mjs` shows a minimal direct Responses API request.

## API Integrations
- OpenAI Responses API via the `openai` package (`client.responses.create`).
- `@openai/agents` for agent scaffolding and configuration.

## MCP / External Services
- No MCP servers or other external integrations are configured in this repository.

## How It Connects
- Uses the `OPENAI_API_KEY` environment variable for authentication.
- Example requests target the `gpt-5-nano` model.

## Quick Start
```bash
npm install
node Genesis.mjs
```
