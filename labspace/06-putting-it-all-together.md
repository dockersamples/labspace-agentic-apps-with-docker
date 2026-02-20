# Putting it all together with Compose

## Learning objectives

In this section, you will complete the following objectives:

- Learn how to use Docker Compose to define the models and tools required by an agentic application
- Update the application to connect to the models and tools provided by Compose

Let's get started!


## The sample app

The sample app you're going to create is an agent that creates jokes about recent events in a specific location. The agent will perform searches on recent events and then use them to generate a light-hearted joke.

The app will use the [Mastra](https://mastra.ai) agentic framework, which is a Typescript-based framework developed by Gatsby. It has many great features, including memory management, tool integration, and workflow execution. The Mastra agents will be exposed through a lightweight Express server.



## 🐙 Setting up the Compose file

The first thing you'll do is create a Compose file that defines the model and MCP tools the application is going to use.

1. Open the :fileLink[`compose.yaml`]{path="03-agentic-app/compose.yaml"} file in the `03-agentic-app` directory.

2. Define the model the app needs to run by adding the following to the `compose.yaml`:

    ```yaml
    models:
      gemma3:
        model: ai/gemma3:4B-Q4_K_M
        context_size: 65000 # ~4 GB VRAM
    ```

3. The next step is to add the required tools. Add the following configuration to define a MCP Gateway in the Compose file after the `models` config:

    ```yaml
    services:
      mcp-gateway:
        image: docker/mcp-gateway
        command: --transport=streaming --servers=duckduckgo
        use_api_socket: true
    ```

4. Finally, add a service for the custom app. This config will tell Docker to build a container image and connect it to the model and MCP gateway:

    ```yaml
    services: # START COPYING AFTER THIS LINE, since you already have the top-level services defined
      app: 
        build:
          context: ./
          target: dev
        models:
          gemma3:
            endpoint_var: OPENAI_BASE_URL
            model_var: OPENAI_MODEL
        ports:
          - 3080:3030
          - 4111:4111
        environment:
          MCP_GATEWAY_URL: http://mcp-gateway:8811/mcp
          OPENAI_API_KEY: "not-required"
        develop:
          watch:
            - path: ./src
              action: sync
              target: /usr/local/app/src
    ```

    The `endpoint_var` and `model_var` fields tell Compose the names of environment variables it should inject into the `app` container to help it connect to the model.

    The `MCP_GATEWAY_URL` environment variable will be used by the app to know how to connect to the MCP server.

5. Validate your Compose file looks like this:

    ```yaml save-as=03-agentic-app/compose.yaml
    models:
      gemma3:
        model: ai/gemma3:4B-Q4_K_M
        context_size: 65000 # ~4 GB VRAM

    services:
      mcp-gateway:
        image: docker/mcp-gateway
        command: --transport=streaming --servers=duckduckgo
        use_api_socket: true

      app: 
        build:
          context: ./
          target: dev
        models:
          gemma3:
            endpoint_var: OPENAI_BASE_URL
            model_var: OPENAI_MODEL
        ports:
          - 3080:3030
          - 4111:4111
        environment:
          MCP_GATEWAY_URL: http://mcp-gateway:8811/mcp
          OPENAI_API_KEY: "not-required"
        develop:
          watch:
            - path: ./src
              action: sync
              target: /usr/local/app/src
    ```

    If you are running this labspace on Docker Engine (without Docker Desktop), you will need to add this below in the `services.app` entry:

    ```yaml
        extra_hosts:
          - "model-runner.docker.internal:host-gateway"
    ```

6. Now, start the stack by running `docker compose up --watch`:

    ```console terminal-id=3-agentic-app
    cd 03-agentic-app
    docker compose up --build --watch
    ```

    The `--watch` flag will start Compose Watch, which will be used to sync files into the container as we make changes.

    Within a moment, everything will be up and running and you can now access your app using :tabLink[http://localhost:3080]{href="http://localhost:3080" title="Agentic app"}

If you try to use the app, you'll see that it doesn't work... yet. While the app has some basic plumbing in place, it needs to be updated to connect to the models and tools.


## 🔌 Connecting the agent to the models and tools

As you saw in the Compose file, the `OPENAI_BASE_URL`, `OPENAI_MODEL`, and `MCP_GATEWAY_URL` environment variables are being defined. The app simply needs to be updated to use them.

1. Open the :fileLink[`src/mastra/agent.ts`]{path="03-agentic-app/src/mastra/agent.ts"} file. This is where the agent is being defined.

2. After the prompt definition, add the following to configure the OpenAI client to connect to the Docker Model Runner:

    ```javascript
    const openai = createOpenAI({
        baseURL: process.env.OPENAI_BASE_URL,
        apiKey: process.env.OPENAI_API_KEY,
    });
    ```

    This is creating an OpenAI client and configuring it to use the base URL defined in the environment variable. If it isn't set, the library will default to the standard OpenAI API endpoints.

    In the Compose file, it defined `OPENAI_API_KEY` and set it to `not-required` as many libraries require the API key to be set, even if it isn't required.

3. After the previous snippet you just added, add the following to create a MCP client that will connect to the MCP Gateway:

    ```javascript
    if (!process.env.MCP_GATEWAY_URL)
      throw new Error("MCP_GATEWAY_URL not defined");

    export const mcp = new MCPClient({
        servers: {
            mcpGateway: {
                url: new URL(process.env.MCP_GATEWAY_URL),
            },
        },
    });
    ```

4. Finally, update the agent to use the model client and tools. Update the `model` and add the `tools` configuration to make the code look like this:

    ```javascript
    export const jokeAgent = new Agent({
      id: 'Joke creator',
      name: "Joke creator",
      instructions: AGENT_PROMPT,
      model: openai.chat(process.env.OPENAI_MODEL || "gpt-4"),
      tools: await mcp.listTools(),
    });
    ```

5. Go back to :tabLink[http://localhost:3080]{href="http://localhost:3080" title="Agentic app"} and give it a try now!

    The app should work! You should see a new joke get generated and the MCP Gateway executions in the log output.

If you'd like, feel free to make changes to the agent's prompt to change how it operates.

> [!IMPORTANT]
> One incredible feature of the Mastra framework is the Mastra Studio. With this Studio, you can interact with the agent directly, test prompts, make changes, and more. Access it in this lab by going to :tabLink[http://localhost:4111]{href="http://localhost:4111" title="Mastra Studio"}.


## Cleaning up

When you're done with this hands-on, complete these steps to stop everything that's running:

1. In the terminal running Compose, press `Ctrl+C` to stop the stack. You should see everything stop and tear down.


## Recap

In this hands-on, you accomplished the following:

- Learned how to write a Compose file that specifies the required models and tools for a project
- Updated code to connect to the model and tools provided by the Compose stack



## Additional resources

- [The Docker MCP Gateway repo](http://github.com/docker/mcp-gateway)
- [Docker MCP Gateway configuration examples](https://github.com/docker/mcp-gateway/tree/main/examples)
