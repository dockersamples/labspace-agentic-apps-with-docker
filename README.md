# Labspace - Building Agentic Apps with Docker

Get up and going with building agentic applications with Compose, Docker Model Runner, and the Docker MCP Gateway.

## Learning objectives

This Labspace will teach you the following:

1. 🧠 Models
    - What are models? How do we interact with them?
    - What is the [Docker Model Runner](https://docs.docker.com/ai/model-runner/)?
    - How do I configure the Docker Model Runner in Compose?
    - How do I write code that connects to the Docker Model Runner?
2. 🛠️ Tools
    - What are tools? How do they work?
    - How does [MCP (Model Context Protocol)](https://modelcontextprotocol.io) fit in?
    - What is the [Docker MCP Gateway](https://docs.docker.com/ai/mcp-gateway/)?
    - How do I start a MCP Gateway?
    - How do I connect to the MCP Gateway in code?
3. 🧑‍💻 Code
    - What are agentic frameworks?
    - How do I define the models and tools my app needs in a Compose file?
    - How do I configure my app to use those models and tools?

## Launch the Labspace

To launch the Labspace, run the following command:

```bash
docker compose -f oci://dockersamples/labspace-agentic-apps-with-docker up -d
```

Note that it may take a little while to start due to the AI model used by the Labspace.

And then open your browser to http://localhost:3030.

### Using the Docker Desktop extension

If you have the Labspace extension installed (`docker extension install dockersamples/labspace-extension` if not), you can also [click this link](https://open.docker.com/dashboard/extension-tab?extensionId=dockersamples/labspace-extension&location=dockersamples/labspace-agentic-apps-with-docker&title=Building%20agentic%20apps%20with%20Docker) to launch the Labspace.