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

With Docker Desktop:
```bash
docker compose -f oci://dockersamples/labspace-agentic-apps-with-docker up -d
```

With Docker Engine:
```bash
docker compose -f oci://dockersamples/labspace-agentic-apps-with-docker -f https://github.com/dockersamples/labspace-agentic-apps-with-docker.git#main:dce-override.compose.yaml up -d
```

Note that it may take a little while to start due to the AI model used by the Labspace.

And then open your browser to http://localhost:3030.

### Using the Docker Desktop extension

If you have the Labspace extension installed (`docker extension install dockersamples/labspace-extension` if not), you can also [click this link](https://open.docker.com/dashboard/extension-tab?extensionId=dockersamples/labspace-extension&location=dockersamples/labspace-agentic-apps-with-docker&title=Building%20agentic%20apps%20with%20Docker) to launch the Labspace.


## Contributing

If you find something wrong or something that needs to be updated, feel free to submit a PR. If you want to make a larger change, feel free to fork the repo into your own repository.

**Important note:** If you fork it, you will need to update the GHA workflow to point to your own Hub repo.

1. Clone this repo

2. Start the Labspace in content development mode:

    ```bash
    # On Mac/Linux
    CONTENT_PATH=$PWD docker compose up --watch

    # On Windows with PowerShell
    $Env:CONTENT_PATH = (Get-Location).Path; docker compose up --watch
    ```

3. Open the Labspace at http://localhost:3030.

4. Make the necessary changes and validate they appear as you expect in the Labspace

    Be sure to check out the [docs](https://github.com/dockersamples/labspace-infra/tree/main/docs) for additional information and guidelines.
